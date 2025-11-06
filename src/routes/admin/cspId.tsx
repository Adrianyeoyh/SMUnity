import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  ExternalLink,
  Globe,
  Heart,
  Mail,
  MapPin,
  Phone,
  Share2,
  Target,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "#client/components/ui/badge";
import { Button } from "#client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#client/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#client/components/ui/dialog";
import { Separator } from "#client/components/ui/separator";

export const Route = createFileRoute("/admin/cspId")({
  component: LeaderCspDetail,
});

// Helper functions
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Community: "bg-orange-100 text-orange-700 hover:bg-orange-200",
    Mentoring: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    Environment: "bg-green-100 text-green-700 hover:bg-green-200",
    Elderly: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    "Arts & Culture": "bg-pink-100 text-pink-700 hover:bg-pink-200",
    "Animal Welfare": "bg-rose-100 text-rose-700 hover:bg-rose-200",
    "Sports & Leisure": "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
    Coding: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
  };
  return colors[category] || "bg-gray-100 text-gray-700 hover:bg-gray-200";
};

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    open: {
      label: "Open",
      className: "bg-green-500 hover:bg-green-600 text-white",
    },
    "closing-soon": {
      label: "Closing Soon",
      className: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
    full: {
      label: "Full",
      className: "bg-gray-500 hover:bg-gray-600 text-white",
    },
    closed: {
      label: "Closed",
      className: "bg-red-500 hover:bg-red-600 text-white",
    },
  };
  return statusConfig[status] || statusConfig["open"];
};

const formatDateRange = (startDate: string, endDate?: string) => {
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, `0`)}/${String(d.getMonth() + 1).padStart(2, `0`)}/${d.getFullYear()}`;
  };
  if (!endDate || startDate === endDate) return formatDate(startDate);
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

function LeaderCspDetail() {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock CSP data — replace later with fetch(`/api/projects/${params.cspId}`)
  const csp = {
    id: "8",
    title: "Project Kidleidoscope",
    organisation: "SMU Kidleidoscope",
    location: "Central",
    category: "Mentoring",
    startDate: "2025-12-07",
    endDate: "2025-06-07",
    duration: "2h, Every Wednesday",
    applicationDeadline: "2025-11-15",
    type: "local",
    serviceHours: 20,
    maxVolunteers: 50,
    currentVolunteers: 15,
    isRemote: false,
    status: "open",
    description: `Initiated in 2013, Project Kidleidoscope empowers children from less privileged backgrounds to pursue their dreams through confidence-building activities and creative expression opportunities.`,
    organisationInfo: {
      name: "SMU Kidleidoscope",
      description:
        "A student-led CSP under the Centre for Social Responsibility (C4SR).",
      website: "https://www.instagram.com/kscopesmu",
      email: "commsvcs@smu.edu.sg",
      phone: "+65 6828 0100",
      address: "70 Stamford Rd, SMU, Singapore",
      isVerified: true,
      foundedYear: 2013,
      totalProjects: 10,
      totalVolunteers: 520,
    },
  };

  const statusBadge = getStatusBadge(csp.status);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Future API call:
      // await fetch(`/api/projects/${csp.id}`, { method: `DELETE` });
      toast.success("CSP deleted successfully!");
      navigate({ to: "/admin/adminDashboard" });
    } catch (error) {
      toast.error("Failed to delete CSP");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="font-body">Back to Dashboard</span>
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`text-xs ${getCategoryColor(csp.category)}`}>
                  {csp.category}
                </Badge>
                <Badge className={`text-xs ${statusBadge.className}`}>
                  {statusBadge.label}
                </Badge>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="font-heading text-foreground mb-3 text-3xl font-bold md:text-4xl">
                    {csp.title}
                  </h1>
                  <div className="text-muted-foreground flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5" />
                    <span className="font-body">{csp.organisation}</span>
                    {csp.organisationInfo.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="bg-muted/50 aspect-video overflow-hidden rounded-xl border shadow-sm">
              <img
                src="https://c4sr.smu.edu.sg/sites/c4sr.smu.edu.sg/files/2025-07/05-LocalCSP-Kidleidoscope-IMG_0015.jpg"
                alt="Project"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2 text-xl">
                  <Target className="text-primary h-5 w-5" />
                  About This Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {csp.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Manage Listing</CardTitle>
                <CardDescription className="font-body">
                  Edit or delete this CSP listing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full"
                  onClick={() => navigate({ to: `/leader/csp/${csp.id}/edit` })}
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit CSP
                </Button>

                <Dialog
                  open={showDeleteDialog}
                  onOpenChange={setShowDeleteDialog}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete CSP
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-heading">
                        Delete CSP Listing
                      </DialogTitle>
                      <DialogDescription className="font-body text-muted-foreground">
                        Are you sure you want to permanently delete{" "}
                        <strong>{csp.title}</strong>? This action cannot be
                        undone.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Confirm Delete"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Organisation Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-lg">
                  About {csp.organisationInfo.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-body mb-3 text-sm">
                  {csp.organisationInfo.description}
                </p>
                <Separator />
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    <a
                      href={`mailto:${csp.organisationInfo.email}`}
                      className="text-primary hover:underline"
                    >
                      {csp.organisationInfo.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="text-muted-foreground h-4 w-4" />
                    <a
                      href={`tel:${csp.organisationInfo.phone}`}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {csp.organisationInfo.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <ExternalLink className="text-muted-foreground h-4 w-4" />
                    <a
                      href={csp.organisationInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
