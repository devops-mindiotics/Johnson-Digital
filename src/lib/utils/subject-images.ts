import MathIcon from '@/assets/subjects/math.svg';
import ScienceIcon from '@/assets/subjects/science.svg';
import EnglishIcon from '@/assets/subjects/english.svg';
import HistoryIcon from '@/assets/subjects/history.svg';
import SSTIcon from '@/assets/subjects/sst.svg';
import HindiIcon from '@/assets/subjects/hindi.svg';
import DefaultIcon from '@/assets/subjects/default.svg';

// The subjectImages object maps a subject ID to an icon.
// If an icon is not found for a specific subject, the default icon is used.
export const subjectImages: { [key: string]: any } = {
  'math-10': MathIcon,
  'sci-10': ScienceIcon,
  'eng-10': EnglishIcon,
  'hist-9': HistoryIcon,
  'sst-10': SSTIcon,
  'hin-10': HindiIcon,
  'math-5': MathIcon,
  'sci-5': ScienceIcon,
  default: DefaultIcon,
};
