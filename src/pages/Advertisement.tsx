import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface AdvertisementProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  linkUrl: string; // New prop for the destination link
}

export const Advertisement = ({ isOpen, onClose, imageUrl, linkUrl }: AdvertisementProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="p-0 border-0">
      <a href={linkUrl} target="_blank" rel="noopener noreferrer">
        <img src={imageUrl} alt="Advertisement" className="w-full h-auto rounded-lg" />
      </a>
    </DialogContent>
  </Dialog>
);