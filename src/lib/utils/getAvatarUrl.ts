
export const getAvatarUrl = (avatarUrl?: string, gender?: string) => {
    if (avatarUrl) return avatarUrl;
    if (gender === 'female') return 'https://firebasestorage.googleapis.com/v0/b/preps-3a1cf.appspot.com/o/dev%2Ffemale.png?alt=media&token=a3683a69-e685-4be3-8a30-25e4c278c792';
    return 'https://firebasestorage.googleapis.com/v0/b/preps-3a1cf.appspot.com/o/dev%2Fmale.png?alt=media&token=8233b323-9599-41e2-a720-f5a63904a44c';
};
