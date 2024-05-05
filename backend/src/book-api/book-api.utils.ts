import { PHYSICAL_FORMAT } from '@shared/manga/manga.enum';

export const physicalFormatStringToEnum = (
  format?: string,
): PHYSICAL_FORMAT => {
  switch (format?.toLowerCase()) {
    case 'paperback':
      return PHYSICAL_FORMAT.PAPERBACK;
    case 'comic':
      return PHYSICAL_FORMAT.PAPERBACK;
    case 'hardcover':
      return PHYSICAL_FORMAT.HARDCOVER;
    case 'ebook':
      return PHYSICAL_FORMAT.EBOOK;
    case 'audiobook':
      return PHYSICAL_FORMAT.AUDIOBOOK;
    default:
      return PHYSICAL_FORMAT.PAPERBACK;
  }
};
