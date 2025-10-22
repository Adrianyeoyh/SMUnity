// import { createFileRoute } from "@tanstack/react-router";
// import { Button } from "#client/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
// import { Badge } from "#client/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "#client/components/ui/tabs";
// import { Progress } from "#client/components/ui/progress";
// import { 
//   Plus, 
//   Users, 
//   Calendar, 
//   Clock, 
//   TrendingUp,
//   CheckCircle,
//   XCircle,
//   Clock as ClockIcon,
//   Eye,
//   Edit,
//   Trash2,
//   BarChart3,
//   PieChart,
//   Activity
// } from "lucide-react";

// export const Route = createFileRoute("/admin/adminDashboard")({
//   component: AdminDashboard,
// });

// function AdminDashboard() {
//   // Mock data for demonstration
//   const stats = {
//     totalCSPs: 12,
//     activeCSPs: 8,
//     totalApplications: 156,
//     pendingApplications: 23,
//     approvedApplications: 98,
//     rejectedApplications: 35,
//     totalVolunteers: 89,
//     totalServiceHours: 1240
//   };

//   const recentApplications = [
//     {
//       id: "1",
//       studentName: "John Doe",
//       studentId: "12345678",
//       cspTitle: "Teaching English to Underprivileged Children",
//       appliedDate: "2024-01-20",
//       status: "pending",
//       motivation: "I have experience working with children and am passionate about education..."
//     },
//     {
//       id: "2",
//       studentName: "Jane Smith",
//       studentId: "87654321",
//       cspTitle: "Environmental Cleanup at East Coast Park",
//       appliedDate: "2024-01-19",
//       status: "approved",
//       motivation: "I'm very interested in environmental conservation and have participated in similar activities..."
//     },
//     {
//       id: "3",
//       studentName: "Mike Johnson",
//       studentId: "11223344",
//       cspTitle: "Senior Care Support",
//       appliedDate: "2024-01-18",
//       status: "rejected",
//       motivation: "I want to help the elderly community and gain experience in healthcare..."
//     }
//   ];

//   const myCSPs = [
//     {
//       id: "1",
//       title: "Teaching English to Underprivileged Children",
//       status: "active",
//       startDate: "2024-02-15",
//       endDate: "2024-05-15",
//       maxVolunteers: 15,
//       currentVolunteers: 8,
//       applications: 23,
//       serviceHours: 40
//     },
//     {
//       id: "2",
//       title: "Environmental Cleanup at East Coast Park",
//       status: "active",
//       startDate: "2024-02-20",
//       endDate: "2024-02-20",
//       maxVolunteers: 50,
//       currentVolunteers: 23,
//       applications: 45,
//       serviceHours: 8
//     },
//     {
//       id: "3",
//       title: "Community Garden Project",
//       status: "completed",
//       startDate: "2023-12-01",
//       endDate: "2023-12-31",
//       maxVolunteers: 30,
//       currentVolunteers: 25,
//       applications: 35,
//       serviceHours: 20
//     }
//   ];

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "approved":
//         return <CheckCircle className="h-4 w-4 text-green-500" />;
//       case "pending":
//         return <ClockIcon className="h-4 w-4 text-yellow-500" />;
//       case "rejected":
//         return <XCircle className="h-4 w-4 text-red-500" />;
//       default:
//         return null;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "approved":
//         return "bg-green-100 text-green-800";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "rejected":
//         return "bg-red-100 text-red-800";
//       case "active":
//         return "bg-blue-100 text-blue-800";
//       case "completed":
//         return "bg-gray-100 text-gray-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="font-heading text-3xl font-bold text-foreground">
//               Admin Dashboard
//             </h1>
//             <p className="text-muted-foreground font-body">
//               Manage your CSPs and applications
//             </p>
//           </div>
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             Create New CSP
//           </Button>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium font-body">Total CSPs</CardTitle>
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold font-heading">{stats.totalCSPs}</div>
//               <p className="text-xs text-muted-foreground font-body">
//                 {stats.activeCSPs} active
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium font-body">Applications</CardTitle>
//               <Users className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold font-heading">{stats.totalApplications}</div>
//               <p className="text-xs text-muted-foreground font-body">
//                 {stats.pendingApplications} pending
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium font-body">Volunteers</CardTitle>
//               <TrendingUp className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold font-heading">{stats.totalVolunteers}</div>
//               <p className="text-xs text-muted-foreground font-body">
//                 Across all CSPs
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium font-body">Service Hours</CardTitle>
//               <Clock className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold font-heading">{stats.totalServiceHours}</div>
//               <p className="text-xs text-muted-foreground font-body">
//                 Hours contributed
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         <Tabs defaultValue="overview" className="space-y-6">
//           <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="csp">My CSPs</TabsTrigger>
//             <TabsTrigger value="applications">Applications</TabsTrigger>
//             <TabsTrigger value="analytics">Analytics</TabsTrigger>
//           </TabsList>

//           {/* Overview Tab */}
//           <TabsContent value="overview" className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Recent Applications */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="font-heading">Recent Applications</CardTitle>
//                   <CardDescription className="font-body">
//                     Latest applications that need your attention
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {recentApplications.map((application) => (
//                     <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
//                       <div className="space-y-1">
//                         <h4 className="font-medium font-body">{application.studentName}</h4>
//                         <p className="text-sm text-muted-foreground font-body">
//                           {application.cspTitle}
//                         </p>
//                         <p className="text-xs text-muted-foreground font-body">
//                           Applied: {new Date(application.appliedDate).toLocaleDateString("en-GB")}
//                         </p>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         {getStatusIcon(application.status)}
//                         <Badge className={getStatusColor(application.status)}>
//                           {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
//                         </Badge>
//                       </div>
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>

//               {/* Quick Actions */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="font-heading">Quick Actions</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <Button className="w-full justify-start">
//                     <Plus className="mr-2 h-4 w-4" />
//                     Create New CSP
//                   </Button>
//                   <Button variant="outline" className="w-full justify-start">
//                     <Eye className="mr-2 h-4 w-4" />
//                     Review Applications
//                   </Button>
//                   <Button variant="outline" className="w-full justify-start">
//                     <BarChart3 className="mr-2 h-4 w-4" />
//                     View Analytics
//                   </Button>
//                   <Button variant="outline" className="w-full justify-start">
//                     <Users className="mr-2 h-4 w-4" />
//                     Manage Volunteers
//                   </Button>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>

//           {/* My CSPs Tab */}
//           <TabsContent value="csp" className="space-y-6">
//             <div className="flex justify-between items-center">
//               <h3 className="font-heading text-xl font-semibold">My CSPs</h3>
//               <Button>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Create New CSP
//               </Button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {myCSPs.map((csp) => (
//                 <Card key={csp.id} className="hover:shadow-lg transition-shadow">
//                   <CardHeader>
//                     <div className="flex justify-between items-start">
//                       <Badge className={getStatusColor(csp.status)}>
//                         {csp.status.charAt(0).toUpperCase() + csp.status.slice(1)}
//                       </Badge>
//                       <div className="flex space-x-1">
//                         <Button variant="ghost" size="icon" className="h-8 w-8">
//                           <Eye className="h-4 w-4" />
//                         </Button>
//                         <Button variant="ghost" size="icon" className="h-8 w-8">
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                         <Button variant="ghost" size="icon" className="h-8 w-8">
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                     <CardTitle className="font-heading text-lg">{csp.title}</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-muted-foreground font-body">Volunteers:</span>
//                         <span className="font-medium font-body">
//                           {csp.currentVolunteers}/{csp.maxVolunteers}
//                         </span>
//                       </div>
//                       <Progress 
//                         value={(csp.currentVolunteers / csp.maxVolunteers) * 100} 
//                         className="h-2" 
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
//                       <div>
//                         <div className="font-body">Applications:</div>
//                         <div className="font-medium font-body">{csp.applications}</div>
//                       </div>
//                       <div>
//                         <div className="font-body">Service Hours:</div>
//                         <div className="font-medium font-body">{csp.serviceHours}h</div>
//                       </div>
//                     </div>

//                     <div className="flex space-x-2">
//                       <Button size="sm" className="flex-1">
//                         Manage
//                       </Button>
//                       <Button size="sm" variant="outline">
//                         View
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           {/* Applications Tab */}
//           <TabsContent value="applications" className="space-y-6">
//             <div className="flex justify-between items-center">
//               <h3 className="font-heading text-xl font-semibold">All Applications</h3>
//               <div className="flex space-x-2">
//                 <Button variant="outline" size="sm">
//                   Filter
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   Export
//                 </Button>
//               </div>
//             </div>

//             <div className="space-y-4">
//               {recentApplications.map((application) => (
//                 <Card key={application.id} className="hover:shadow-md transition-shadow">
//                   <CardContent className="pt-6">
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="space-y-1">
//                         <h4 className="font-heading text-lg font-semibold">
//                           {application.studentName}
//                         </h4>
//                         <p className="text-muted-foreground font-body">
//                           Student ID: {application.studentId}
//                         </p>
//                         <p className="text-sm text-muted-foreground font-body">
//                           {application.cspTitle}
//                         </p>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         {getStatusIcon(application.status)}
//                         <Badge className={getStatusColor(application.status)}>
//                           {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
//                         </Badge>
//                       </div>
//                     </div>

//                     <div className="mb-4">
//                       <p className="text-sm text-muted-foreground font-body">
//                         <strong>Motivation:</strong> {application.motivation}
//                       </p>
//                     </div>

//                     <div className="flex justify-between items-center">
//                       <div className="text-sm text-muted-foreground font-body">
//                         Applied: {new Date(application.appliedDate).toLocaleDateString("en-GB")}
//                       </div>
//                       <div className="flex space-x-2">
//                         {application.status === "pending" && (
//                           <>
//                             <Button size="sm" variant="outline">
//                               Approve
//                             </Button>
//                             <Button size="sm" variant="outline">
//                               Reject
//                             </Button>
//                           </>
//                         )}
//                         <Button size="sm" variant="ghost">
//                           View Details
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           {/* Analytics Tab */}
//           <TabsContent value="analytics" className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="font-heading">Application Trends</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="h-64 flex items-center justify-center text-muted-foreground font-body">
//                     <div className="text-center">
//                       <BarChart3 className="h-12 w-12 mx-auto mb-4" />
//                       <p>Chart visualization coming soon</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="font-heading">CSP Performance</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="h-64 flex items-center justify-center text-muted-foreground font-body">
//                     <div className="text-center">
//                       <PieChart className="h-12 w-12 mx-auto mb-4" />
//                       <p>Chart visualization coming soon</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }






import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "#client/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#client/components/ui/card";
import { Badge } from "#client/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#client/components/ui/tabs";
import { Progress } from "#client/components/ui/progress";
import { 
  Plus, 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

export const Route = createFileRoute("/admin/adminDashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();

  // Mock data for demonstration
  const stats = {
    totalCSPs: 12,
    activeCSPs: 8,
    totalApplications: 156,
    pendingApplications: 23,
    approvedApplications: 98,
    rejectedApplications: 35,
    totalVolunteers: 89,
    totalServiceHours: 1240
  };

  const recentApplications = [
    {
      id: "1",
      studentName: "John Doe",
      studentId: "12345678",
      cspTitle: "Teaching English to Underprivileged Children",
      appliedDate: "2024-01-20",
      status: "pending",
      motivation: "I have experience working with children and am passionate about education..."
    },
    {
      id: "2",
      studentName: "Jane Smith",
      studentId: "87654321",
      cspTitle: "Environmental Cleanup at East Coast Park",
      appliedDate: "2024-01-19",
      status: "approved",
      motivation: "I'm very interested in environmental conservation and have participated in similar activities..."
    },
    {
      id: "3",
      studentName: "Mike Johnson",
      studentId: "11223344",
      cspTitle: "Senior Care Support",
      appliedDate: "2024-01-18",
      status: "rejected",
      motivation: "I want to help the elderly community and gain experience in healthcare..."
    }
  ];

  const myCSPs = [
    {
      id: "1",
      title: "Teaching English to Underprivileged Children",
      status: "active",
      startDate: "2024-02-15",
      endDate: "2024-05-15",
      maxVolunteers: 15,
      currentVolunteers: 8,
      applications: 23,
      serviceHours: 40
    },
    {
      id: "2",
      title: "Environmental Cleanup at East Coast Park",
      status: "active",
      startDate: "2024-02-20",
      endDate: "2024-02-20",
      maxVolunteers: 50,
      currentVolunteers: 23,
      applications: 45,
      serviceHours: 8
    },
    {
      id: "3",
      title: "Community Garden Project",
      status: "completed",
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      maxVolunteers: 30,
      currentVolunteers: 25,
      applications: 35,
      serviceHours: 20
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground font-body">
              Manage all CSPs and applications
            </p>
          </div>
          {/* <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New CSP
          </Button> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="mb-0 md:mb-3 lg:mb-8">
            <div className="grid grid-cols-1 mb-3 md:grid-cols-2 md:mb-3 lg:grid-cols-2 lg:mb-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-body">Total CSPs</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-heading">{stats.totalCSPs}</div>
                  <p className="text-xs text-muted-foreground font-body">
                    {stats.activeCSPs} active
                  </p>
                </CardContent>
              </Card>
              <Card className="mb-3 sm:mb-3 md:mb-0 lg:mb-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-body">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-heading">{stats.totalApplications}</div>
                  <p className="text-xs text-muted-foreground font-body">
                    {/* {stats.pendingApplications} */}
                    Active
                  </p>
                  {/* current code: pending == pending application for a csp, perhaps this can be "total users instead?" */}
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 mb-3 md:grid-cols-2 md:mb-0 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-body">Organisations</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-heading">{stats.totalVolunteers}</div>
                  <p className="text-xs text-muted-foreground font-body">
                    Across all CSPs
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium font-body">Service Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-heading">{stats.totalServiceHours}</div>
                  <p className="text-xs text-muted-foreground font-body">
                    Hours contributed
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New CSP
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="mr-2 h-4 w-4" />
                  Review Applications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Volunteers
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="csp">My CSPs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Latest CSPs</CardTitle>
                  <CardDescription className="font-body">
                    View the most recent CSP listings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myCSPs.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium font-body">{listing.title}</h4>
                        <p className="text-sm text-muted-foreground font-body">
                          Current Volunteers: {listing.currentVolunteers}
                        </p>
                        <p className="text-xs text-muted-foreground font-body">
                          Start Date: {new Date(listing.startDate).toLocaleDateString("en-GB")}
                        </p>
                        <p className="text-xs text-muted-foreground font-body">
                          End Date: {new Date(listing.endDate).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(listing.status)}
                        <Badge className={getStatusColor(listing.status)}>
                          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New CSP
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="mr-2 h-4 w-4" />
                    Review Applications
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Volunteers
                  </Button>
                </CardContent>
              </Card> */}
            </div>
          </TabsContent>

          {/* My CSPs Tab */}
          <TabsContent value="csp" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-heading text-xl font-semibold">My CSPs</h3>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New CSP
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCSPs.map((csp) => (
                <Card key={csp.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge className={getStatusColor(csp.status)}>
                        {csp.status.charAt(0).toUpperCase() + csp.status.slice(1)}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="font-heading text-lg">{csp.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-body">Volunteers:</span>
                        <span className="font-medium font-body">
                          {csp.currentVolunteers}/{csp.maxVolunteers}
                        </span>
                      </div>
                      <Progress 
                        value={(csp.currentVolunteers / csp.maxVolunteers) * 100} 
                        className="h-2" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <div className="font-body">Applications:</div>
                        <div className="font-medium font-body">{csp.applications}</div>
                      </div>
                      <div>
                        <div className="font-body">Service Hours:</div>
                        <div className="font-medium font-body">{csp.serviceHours}h</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        Manage
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate({ to: "/admin/cspId" })}>
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-heading text-xl font-semibold">All Applications</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Export
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {recentApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <h4 className="font-heading text-lg font-semibold">
                          {application.studentName}
                        </h4>
                        <p className="text-muted-foreground font-body">
                          Student ID: {application.studentId}
                        </p>
                        <p className="text-sm text-muted-foreground font-body">
                          {application.cspTitle}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(application.status)}
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground font-body">
                        <strong>Motivation:</strong> {application.motivation}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground font-body">
                        Applied: {new Date(application.appliedDate).toLocaleDateString("en-GB")}
                      </div>
                      <div className="flex space-x-2">
                        {application.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              Reject
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Application Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground font-body">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                      <p>Chart visualization coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">CSP Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground font-body">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 mx-auto mb-4" />
                      <p>Chart visualization coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
