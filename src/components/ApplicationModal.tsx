import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { addApplication } from '@/utils/applicationManager';
import { X, Loader2 } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  csp: {
    id: string;
    title: string;
    organization: string;
    spots: number;
  };
  onSuccess: () => void;
}

interface ApplicationFormData {
  name: string;
  school: string;
  yearOfStudy: string;
  motivation: string;
  acknowledgeTerms: boolean;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  csp,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    school: user ? 'Singapore Management University' : '',
    yearOfStudy: '',
    motivation: '',
    acknowledgeTerms: false
  });

  const yearOptions = [
    'Year 1',
    'Year 2', 
    'Year 3',
    'Year 4',
    'Graduate Student',
    'Alumni'
  ];

  const handleInputChange = (field: keyof ApplicationFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acknowledgeTerms) {
      toast({
        title: "Acknowledgement Required",
        description: "Please acknowledge the terms and conditions before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit your application.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create application data
      const applicationData = {
        projectId: csp.id,
        projectTitle: csp.title,
        organization: csp.organization,
        status: 'pending',
        appliedAt: new Date().toISOString(),
        message: formData.motivation,
        skills: [], // Could be populated from user profile
        studentInfo: {
          name: formData.name,
          school: formData.school,
          yearOfStudy: formData.yearOfStudy
        }
      };

      // Add application using the application manager
      await addApplication(applicationData);
      
      toast({
        title: "Application Submitted!",
        description: "Your application has been submitted successfully. You'll receive updates via email.",
      });

      // Reset form and close modal
      setFormData({
        name: user ? `${user.firstName} ${user.lastName}` : '',
        school: user ? 'Singapore Management University' : '',
        yearOfStudy: '',
        motivation: '',
        acknowledgeTerms: false
      });
      
      onSuccess();
      onClose();
      
    } catch (error) {
      console.error('Failed to submit application:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Apply for {csp.title}
          </DialogTitle>
          <DialogDescription>
            Submit your application for this community service project at {csp.organization}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Project Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Project Details</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Organization:</strong> {csp.organization}</p>
              <p><strong>Available Spots:</strong> {csp.spots}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Personal Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School *</Label>
                <Input
                  id="school"
                  value={formData.school}
                  onChange={(e) => handleInputChange('school', e.target.value)}
                  placeholder="Enter your school"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearOfStudy">Year of Study *</Label>
              <Select 
                value={formData.yearOfStudy} 
                onValueChange={(value) => handleInputChange('yearOfStudy', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your year of study" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Motivation */}
          <div className="space-y-2">
            <Label htmlFor="motivation">
              Why should you be selected for this project? (Optional)
            </Label>
            <Textarea
              id="motivation"
              value={formData.motivation}
              onChange={(e) => handleInputChange('motivation', e.target.value)}
              placeholder="Tell us about your interest in this project, relevant experience, or what you hope to contribute..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {/* Acknowledgement */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="acknowledgeTerms"
                checked={formData.acknowledgeTerms}
                onCheckedChange={(checked) => handleInputChange('acknowledgeTerms', checked as boolean)}
                disabled={isSubmitting}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label htmlFor="acknowledgeTerms" className="text-sm leading-relaxed cursor-pointer">
                  By applying, I acknowledge that:
                </Label>
                <ul className="text-xs text-gray-600 space-y-1 ml-0">
                  <li>• I can adhere to the volunteer timings and commitment requirements</li>
                  <li>• I have completed the CSU module on eLearn</li>
                  <li>• I understand this is a community service project for academic credit</li>
                  <li>• I will maintain professional conduct throughout the project</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.acknowledgeTerms}
              className="flex-1 smu-gradient"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
