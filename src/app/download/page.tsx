import { generatePageMetadata } from '@/lib/page-metadata';
import ClientDownloadPage from './ClientDownloadPage';

export const metadata = generatePageMetadata('download');

export default function DownloadPage() {
  return <ClientDownloadPage />;
}
