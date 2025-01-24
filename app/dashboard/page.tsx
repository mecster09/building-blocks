import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Home, ListTodo, Star, Clock, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Priority = "high" | "medium" | "low"
type Status = "in-progress" | "completed"

interface Task {
  id: number
  title: string
  priority: Priority
  status: Status
  important: boolean
}

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <ListTodo className="h-6 w-6" />
              <span className="font-semibold">Task Dashboard</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <nav className="grid gap-1 px-2">
              <a
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                href="/dashboard"
              >
                <Home className="h-4 w-4" />
                Overview
              </a>
              <a
                className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2 text-sm transition-colors"
                href="/dashboard/tasks"
              >
                <ListTodo className="h-4 w-4" />
                Tasks
              </a>
            </nav>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <div className="container mx-auto p-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tasks</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-6 grid gap-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Tasks
                    </CardTitle>
                    <ListTodo className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      In Progress
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completed
                    </CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList>
                      <TabsTrigger value="all">All Tasks</TabsTrigger>
                      <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <th className="w-[50px]"></th>
                            <th>Task</th>
                            <th className="w-[100px]">Priority</th>
                            <th className="w-[100px]">Status</th>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tasks.map((task) => (
                            <TableRow key={task.id}>
                              <td>
                                <Star
                                  className={cn(
                                    "h-4 w-4",
                                    task.important
                                      ? "fill-primary text-primary"
                                      : "text-muted-foreground"
                                  )}
                                />
                              </td>
                              <td>{task.title}</td>
                              <td>
                                <span
                                  className={cn(
                                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                    {
                                      "bg-red-100 text-red-700 dark:bg-red-900/30":
                                        task.priority === "high",
                                      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30":
                                        task.priority === "medium",
                                      "bg-green-100 text-green-700 dark:bg-green-900/30":
                                        task.priority === "low",
                                    }
                                  )}
                                >
                                  {task.priority}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={cn(
                                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                    {
                                      "bg-blue-100 text-blue-700 dark:bg-blue-900/30":
                                        task.status === "in-progress",
                                      "bg-green-100 text-green-700 dark:bg-green-900/30":
                                        task.status === "completed",
                                    }
                                  )}
                                >
                                  {task.status}
                                </span>
                              </td>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    <TabsContent value="in-progress">
                      {/* Similar table structure for in-progress tasks */}
                    </TabsContent>
                    <TabsContent value="completed">
                      {/* Similar table structure for completed tasks */}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

const tasks: Task[] = [
  {
    id: 1,
    title: "Create new landing page",
    priority: "high",
    status: "in-progress",
    important: true,
  },
  {
    id: 2,
    title: "Update user documentation",
    priority: "medium",
    status: "completed",
    important: false,
  },
  {
    id: 3,
    title: "Fix navigation bug",
    priority: "high",
    status: "in-progress",
    important: true,
  },
  {
    id: 4,
    title: "Add dark mode support",
    priority: "medium",
    status: "completed",
    important: false,
  },
  {
    id: 5,
    title: "Implement authentication",
    priority: "high",
    status: "in-progress",
    important: true,
  },
] 