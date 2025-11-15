'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MonitorPlay, ChevronDown, FileText, Video, Presentation, Image as ImageIcon, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getAllSeries, getAllClasses, getAllSubjects, getAllPackages, getAllContentTypes } from '@/lib/api/masterApi';
import { getLessonsByClassIdAndSubjectId } from '@/lib/api/lessonApi';
import { createAttachment, getSignedUrl, uploadFileToSignedUrl, getSubjectContent } from '@/lib/api/attachmentApi';

const getContentTypeIcon = (contentType) => {
    const type = contentType?.toLowerCase();
    switch (type) {
        case 'video': return <Video className="h-5 w-5 text-blue-500" />;
        case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
        case 'ppt': return <Presentation className="h-5 w-5 text-orange-500" />;
        case 'image': return <ImageIcon className="h-5 w-5 text-purple-500" />;
        default: return <FileText className="h-5 w-5" />;
    }
};

const StatusBadge = ({ status }) => {
  const statusVariant = { active: 'success', inactive: 'destructive' }[status] || 'default';
  return <Badge variant={statusVariant}>{status}</Badge>;
};

export default function ContentManagementPage() {
    const { user } = useAuth();
    const isTenantAdmin = user?.roles.includes('TENANT_ADMIN');
    const [contentData, setContentData] = useState({});
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showFilters, setShowFilters] = useState(true); // Default to showing filters

    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('add') === 'true' && isTenantAdmin) {
            setIsAddDialogOpen(true);
        }
    }, [searchParams, isTenantAdmin]);

    const handleAddContent = (newContent) => {
        // In a real app, you would refetch the content list here
        setIsAddDialogOpen(false);
        setShowSuccessDialog(true);
    };

    const handleNextContent = () => {
        setShowSuccessDialog(false);
        setIsAddDialogOpen(true);
    };

    const handleSearch = (filters) => {
        const fetchContent = async () => {
            if (!user?.tenantId) return;
            try {
                const content = await getSubjectContent(user.tenantId, {
                    class: filters.classId,
                    series: filters.seriesId,
                    subject: filters.subjectId,
                    package: filters.packageId || 'NA',
                });

                // Group content by lesson
                const groupedByLesson = content.reduce((acc, item) => {
                    const key = `${item.class}-${item.series}-${item.subject}-${item.lesson}`;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push({ 
                        contentType: item.filename.split('.').pop(), // Simple type extraction
                        contentName: item.filename,
                        status: item.status,
                        package: item.package
                    });
                    return acc;
                }, {});
                setContentData(groupedByLesson);
            } catch (error) {
                console.error("Failed to fetch content:", error);
                setContentData({}); // Reset on error
            }
        };

        fetchContent();
    };

    return (
        <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Content Management</CardTitle>
                    <CardDescription>Manage all your learning materials in one place.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {isTenantAdmin && (
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                            <MonitorPlay className="mr-2 h-4 w-4" /> Add New Content
                        </Button>
                    )}
                    <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> {showFilters ? 'Hide' : 'Show'} Filters
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {showFilters && <FilterControls onSearch={handleSearch} />}
                <ContentList contentData={contentData} />
              </CardContent>
            </Card>
            
            {isTenantAdmin && <AddContentDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddContent={handleAddContent} />}
            
            <ConfirmationDialog 
                isOpen={showSuccessDialog} 
                onNext={handleNextContent}
                onDismiss={() => setShowSuccessDialog(false)}
            />
        </>
    );
}

function FilterControls({ onSearch }) {
    const [filters, setFilters] = useState({ classId: '', seriesId: '', subjectId: '', packageId: '' });
    const [classes, setClasses] = useState([]);
    const [series, setSeries] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        const fetchFiltersData = async () => {
            try {
                const [classesData, seriesData, packagesData] = await Promise.all([
                    getAllClasses(), getAllSeries(), getAllPackages(),
                ]);
                setClasses(classesData);
                setSeries(seriesData);
                setPackages(packagesData);
            } catch (error) { console.error("Failed to fetch filters data:", error); }
        };
        fetchFiltersData();
    }, []);

    // Fetch subjects when a class is selected
    useEffect(() => {
        if (filters.classId) {
            getAllSubjects(filters.classId).then(setSubjects).catch(err => console.error(err));
        } else {
            setSubjects([]); // Clear subjects if no class is selected
        }
    }, [filters.classId]);

    const handleSelectChange = (name, value) => {
        setFilters(prev => {
            const newFilters = { ...prev, [name]: value };
            if (name === 'classId') {
                newFilters.subjectId = ''; // Reset subject when class changes
            }
            return newFilters;
        });
    };

    const handleSearchClick = () => {
        if (filters.classId && filters.seriesId && filters.subjectId) {
            onSearch(filters);
        } else {
            alert('Please select Class, Series, and Subject.');
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 border rounded-lg">
            <div className="flex-1 min-w-[150px]"><Label>Class</Label><Select name="classId" value={filters.classId} onValueChange={(v) => handleSelectChange('classId', v)}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{classes.map((o) => (<SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>))}</SelectContent></Select></div>
            <div className="flex-1 min-w-[150px]"><Label>Series</Label><Select name="seriesId" value={filters.seriesId} onValueChange={(v) => handleSelectChange('seriesId', v)}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{series.map((o) => (<SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>))}</SelectContent></Select></div>
            <div className="flex-1 min-w-[150px]"><Label>Subject</Label><Select name="subjectId" value={filters.subjectId} onValueChange={(v) => handleSelectChange('subjectId', v)} disabled={!filters.classId}><SelectTrigger><SelectValue placeholder={!filters.classId ? "Select Class first" : "Select..."} /></SelectTrigger><SelectContent>{subjects.map((o) => (<SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>))}</SelectContent></Select></div>
            <div className="flex-1 min-w-[150px]"><Label>Package (Optional)</Label><Select name="packageId" value={filters.packageId} onValueChange={(v) => handleSelectChange('packageId', v)}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{packages.map((o) => (<SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>))}</SelectContent></Select></div>
            <Button onClick={handleSearchClick} className="self-end">Search</Button>
        </div>
    );
}

function ContentList({ contentData }) {
    const [openKey, setOpenKey] = useState(null);

    useEffect(() => {
        // Automatically open the first group if contentData is available
        const keys = Object.keys(contentData);
        setOpenKey(keys.length > 0 ? keys[0] : null);
    }, [contentData]);


    return (
        <div className="space-y-4">
            {Object.keys(contentData).length === 0 ? (
                <div className="text-center py-10"><p className="text-muted-foreground">No content found. Use the filters above to search for content.</p></div>
            ) : (
                Object.entries(contentData).map(([key, contents]) => {
                    const [classValue, seriesValue, subjectValue, lesson] = key.split('-');
                    const isRowOpen = openKey === key;
                    return (
                        <Card key={key}>
                            <CardHeader className="flex flex-row justify-between items-center p-4 cursor-pointer" onClick={() => setOpenKey(isRowOpen ? null : key)}>
                                <div>
                                    <CardTitle className="text-lg">{lesson}</CardTitle>
                                    <CardDescription>{`${classValue} • ${seriesValue} • ${subjectValue}`}</CardDescription>
                                </div>
                                <ChevronDown className={`transform transition-transform ${isRowOpen ? 'rotate-180' : ''}`} />
                            </CardHeader>
                            {isRowOpen && (
                                <CardContent className="p-4 border-t">
                                    {contents.map((content, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                            <div className="flex items-center gap-3">
                                                {getContentTypeIcon(content.contentType)}
                                                <p className="font-medium">{content.contentName}</p>
                                            </div>
                                            <StatusBadge status={content.status} />
                                        </div>
                                    ))}
                                </CardContent>
                            )}
                        </Card>
                    );
                })
            )}
        </div>
    );
}

function ContentTypeBox({ icon, label, isSelected, onSelect }) {
    return (
        <div
            onClick={onSelect}
            className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
            }`}>
            {icon}
            <span className="mt-2 text-sm font-medium">{label}</span>
        </div>
    );
}

function AddContentDialog({ isOpen, onOpenChange, onAddContent }) {
    const { user } = useAuth();
    const [formValues, setFormValues] = useState({ classId: '', seriesId: '', packageId: '', subjectId: '', lessonId: '', contentName: '' });
    const [selectedVisualContentType, setSelectedVisualContentType] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [classes, setClasses] = useState([]);
    const [series, setSeries] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [packages, setPackages] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [contentNameOptions, setContentNameOptions] = useState([]);

    useEffect(() => {
        async function fetchDropdowns() {
            if (isOpen) {
                try {
                    const [cls, srs, sub, pkg, contentTypes] = await Promise.all([
                        getAllClasses(), getAllSeries(), getAllSubjects(), getAllPackages(), getAllContentTypes()
                    ]);
                    setClasses(cls);
                    setSeries(srs);
                    setSubjects(sub);
                    setPackages(pkg);
                    setContentNameOptions(contentTypes);
                } catch (error) { 
                    console.error("Failed to fetch dropdown data:", error);
                }
            }
        }
        fetchDropdowns();
    }, [isOpen]);

    useEffect(() => {
        async function fetchLessons() {
            if (formValues.classId && formValues.subjectId) {
                try {
                    const lessonsData = await getLessonsByClassIdAndSubjectId(formValues.classId, formValues.subjectId);
                    setLessons(lessonsData);
                } catch (error) {
                    console.error("Failed to fetch lessons:", error);
                    setLessons([]); // Clear on error
                }
            } else {
                setLessons([]); // Clear if class/subject is not selected
            }
        }
        fetchLessons();
    }, [formValues.classId, formValues.subjectId]);

    const handleSelectChange = (name, value) => {
      setFormValues(prev => {
        const newValues = { ...prev, [name]: value };
        if (name === 'classId' || name === 'subjectId') {
            newValues.lessonId = '';
        }
        return newValues;
      });
    };
    
    const handleFileChange = (e) => setSelectedFile(e.target.files ? e.target.files[0] : null);

    const resetForm = () => {
        setFormValues({ classId: '', seriesId: '', packageId: '', subjectId: '', lessonId: '', contentName: '' });
        setSelectedVisualContentType('');
        setSelectedFile(null);
        setLessons([]);
        if (document.getElementById('upload')) {
          document.getElementById('upload').value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) { alert("File upload is mandatory."); return; }
        if (!selectedVisualContentType) { alert("Please select a Content Type."); return; }

        setIsSubmitting(true);
        try {
            const signedUrlPayload = {
                bucketType: "content",
                series: formValues.seriesId,
                subject: formValues.subjectId,
                lesson: formValues.lessonId,
                package: formValues.packageId || "NA",
                class: formValues.classId,
                contentType: selectedFile.type,
                filename: selectedFile.name,
                expiresIn: 3600
            };
            const signedUrlData = await getSignedUrl(signedUrlPayload);
            await uploadFileToSignedUrl(signedUrlData.uploadUrl, selectedFile);

            await createAttachment({
                attachmentId: signedUrlData.attachmentId,
                name: formValues.contentName,
                type: selectedVisualContentType.toLowerCase(),
                mimeType: selectedFile.type,
                packageId: formValues.packageId || "NA",
            }, user.id);

            onAddContent({ ...formValues, contentType: selectedVisualContentType, attachmentId: signedUrlData.attachmentId });
            resetForm();
        } catch (error) {
            console.error("Content creation failed:", error);
            alert("Failed to upload content. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) resetForm(); onOpenChange(open); }}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add New Content</DialogTitle>
                    <DialogDescription>Fill in the details below to add new content.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 overflow-y-auto max-h-[70vh]">
                        <div className="space-y-2"><Label>Class</Label><Select name="classId" value={formValues.classId} onValueChange={(v) => handleSelectChange('classId', v)} required><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{classes.map((o) => (<SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>))}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Series</Label><Select name="seriesId" value={formValues.seriesId} onValueChange={(v) => handleSelectChange('seriesId', v)} required><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{series.map((o) => (<SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>))}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Subject</Label><Select name="subjectId" value={formValues.subjectId} onValueChange={(v) => handleSelectChange('subjectId', v)} required><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{subjects.map((o) => (<SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>))}</SelectContent></Select></div>
                        <div className="space-y-2"><Label>Package (Optional)</Label><Select name="packageId" value={formValues.packageId} onValueChange={(v) => handleSelectChange('packageId', v)}><SelectTrigger><SelectValue placeholder="Select package (optional)" /></SelectTrigger><SelectContent>{packages.map((o) => (<SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>))}</SelectContent></Select></div>
                        <div className="space-y-2">
                            <Label>Lesson</Label>
                            <Select name="lessonId" value={formValues.lessonId} onValueChange={(v) => handleSelectChange('lessonId', v)} required disabled={!formValues.classId || !formValues.subjectId}>
                                <SelectTrigger><SelectValue placeholder={!formValues.classId || !formValues.subjectId ? "Select Class & Subject first" : "Select..."} /></SelectTrigger>
                                <SelectContent>{lessons.map((o) => (<SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label>Content Type</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                                <ContentTypeBox icon={<Video className="h-7 w-7" />} label="Video" isSelected={selectedVisualContentType === 'Video'} onSelect={() => setSelectedVisualContentType('Video')} />
                                <ContentTypeBox icon={<FileText className="h-7 w-7" />} label="PDF" isSelected={selectedVisualContentType === 'PDF'} onSelect={() => setSelectedVisualContentType('PDF')} />
                                <ContentTypeBox icon={<Presentation className="h-7 w-7" />} label="PPT" isSelected={selectedVisualContentType === 'PPT'} onSelect={() => setSelectedVisualContentType('PPT')} />
                                <ContentTypeBox icon={<ImageIcon className="h-7 w-7" />} label="Image" isSelected={selectedVisualContentType === 'Image'} onSelect={() => setSelectedVisualContentType('Image')} />
                            </div>
                        </div>
                         <div className="space-y-2">
                             <Label>Content Name</Label>
                             <Select name="contentName" value={formValues.contentName} onValueChange={(v) => handleSelectChange('contentName', v)} required>
                                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                <SelectContent>
                                    {contentNameOptions && contentNameOptions.map((o) => (
                                        <SelectItem key={o.id} value={o.name}>{o.name}</SelectItem>
                                    ))}
                                </SelectContent>
                             </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="upload">Upload</Label>
                            <Input id="upload" type="file" onChange={handleFileChange} required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Uploading...' : 'Upload Content'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function ConfirmationDialog({ isOpen, onNext, onDismiss }) {
    return (
        <Dialog open={isOpen} onOpenChange={onDismiss}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Success!</DialogTitle>
                    <DialogDescription>Your content has been uploaded successfully.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onDismiss}>Dismiss</Button>
                    <Button onClick={onNext}>Add Next Content</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
