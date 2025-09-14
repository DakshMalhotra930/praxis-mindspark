import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Image, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (imageData: string) => void;
  onCancel: () => void;
}

export const ImageUpload = ({ onImageUpload, onCancel }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB.');
      return;
    }

    setProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setSelectedImage(imageData);
      setProcessing(false);
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
      setProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (selectedImage) {
      onImageUpload(selectedImage);
    }
  };

  const handleRemove = () => {
    setSelectedImage(null);
  };

  return (
    <Card className="academic-card">
      <CardContent className="p-6">
        {!selectedImage ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              {processing ? (
                <div className="space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-sm text-muted-foreground">Processing image...</p>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium mb-1">
                      Upload a problem image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Drag & drop or click to select • PNG, JPG up to 5MB
                    </p>
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    <label htmlFor="file-upload">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="cursor-pointer hover-glow"
                      >
                        <Image className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </label>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected problem"
                className="w-full max-h-96 object-contain rounded-lg border"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleRemove}
                size="sm"
              >
                Change Image
              </Button>
              
              <Button
                onClick={handleUpload}
                size="sm"
                className="bg-gradient-primary hover:bg-gradient-secondary hover-glow"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload & Solve
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};