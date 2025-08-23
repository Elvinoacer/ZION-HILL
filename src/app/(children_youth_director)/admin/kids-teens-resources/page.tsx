"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Edit,
  Image as ImageIcon,
  Loader2,
  Mic,
  PlusCircle,
  Search,
  Trash2,
  Video,
  X,
  ExternalLink,
  Tag,
  FileText,
  Inbox,
  UploadCloud
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Resource {
    id: string;
    title: string;
    type: string;
    tags: string[];
    url?: string;
    description?: string;
}

const typeConfig: { [key: string]: { icon: React.ElementType, color: string, gradient: string } } = {
    VIDEO: { icon: Video, color: "text-red-500", gradient: "from-red-400/30 via-red-500/20 to-red-600/10" },
    AUDIO: { icon: Mic, color: "text-blue-500", gradient: "from-blue-400/30 via-blue-500/20 to-blue-600/10" },
    IMAGE: { icon: ImageIcon, color: "text-purple-500", gradient: "from-purple-400/30 via-purple-500/20 to-purple-600/10" },
    DOCUMENT: { icon: FileText, color: "text-green-500", gradient: "from-green-400/30 via-green-500/20 to-green-600/10" },
    ACTIVITY: { icon: BookOpen, color: "text-yellow-500", gradient: "from-yellow-400/30 via-yellow-500/20 to-yellow-600/10" },
    default: { icon: FileText, color: "text-gray-500", gradient: "from-gray-400/30 via-gray-500/20 to-gray-600/10" },
};

const AdminKidsTeensResources = () => {
  const { data: session } = useSession();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState<Resource | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formState, setFormState] = useState({
    title: "", type: "", tags: "", url: "", description: "", file: null as File | null
  });

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/kids-teens-resources");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setResources(data);
    } catch (error: any) {
      setError(error.message);
      toast.error("Failed to load resources.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const filteredResources = useMemo(() => {
    return resources.filter(resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [resources, searchTerm]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formState.title || !formState.type) {
        toast.error("Title and Type are required fields.");
        return;
    }
    setIsSubmitting(true);
    
    try {
        let fileUrl = formState.url;
        if (formState.file) {
            const formData = new FormData();
            formData.append("file", formState.file);
            const uploadRes = await fetch("/api/upload-image", { method: "POST", body: formData });
            if (!uploadRes.ok) throw new Error("Failed to upload image.");
            const uploadData = await uploadRes.json();
            fileUrl = uploadData.url;
        }

        const resourceData = {
            title: formState.title,
            type: formState.type,
            tags: formState.tags.split(",").map(tag => tag.trim()).filter(Boolean),
            url: fileUrl,
            description: formState.description,
            uploaderId: session!.user.id,
        };

        const url = currentResource ? `/api/kids-teens-resources?id=${currentResource.id}` : "/api/kids-teens-resources";
        const method = currentResource ? "PUT" : "POST";

        const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(resourceData) });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        toast.success(`Resource ${currentResource ? "updated" : "created"} successfully.`);
        resetFormAndCloseDialog();
        fetchResources();
    } catch (apiError: any) {
        toast.error(`Failed to ${currentResource ? "update" : "create"} resource: ${apiError.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    toast.warning("Are you sure you want to delete this resource?", {
        action: { label: "Delete", onClick: async () => {
            try {
                const response = await fetch(`/api/kids-teens-resources?id=${id}`, { method: "DELETE" });
                if (!response.ok) throw new Error((await response.json()).error || "Failed to delete");
                toast.success("Resource deleted successfully.");
                fetchResources();
            } catch (error: any) {
                toast.error(`Failed to delete resource: ${error.message}`);
            }
        }},
        cancel: { label: "Cancel" },
    });
  };

  const openDialogForEdit = (resource: Resource) => {
    setCurrentResource(resource);
    setFormState({ ...resource, tags: resource.tags.join(", "), file: null });
    setIsDialogOpen(true);
  };

  const resetFormAndCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentResource(null);
    setFormState({ title: "", type: "", tags: "", url: "", description: "", file: null });
  };

  if (loading && resources.length === 0) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <Header onAddNew={() => { resetFormAndCloseDialog(); setIsDialogOpen(true); }} onSearch={setSearchTerm} />
        <ResourceGrid resources={filteredResources} onEdit={openDialogForEdit} onDelete={handleDeleteClick} />
        <ResourceDialog {...{ isDialogOpen, resetFormAndCloseDialog, formState, setFormState, handleFormSubmit, isSubmitting, currentResource }} />
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-10 w-48 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-full max-w-md mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
                <Card key={i} className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm overflow-hidden">
                    <Skeleton className="h-40 w-full" />
                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2"><Skeleton className="h-8 w-16 rounded-md" /><Skeleton className="h-8 w-16 rounded-md" /></CardFooter>
                </Card>
            ))}
        </div>
    </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="min-h-screen flex items-center justify-center text-red-500">Error: {message}</div>
);

const Header = ({ onAddNew, onSearch }: { onAddNew: () => void, onSearch: (term: string) => void }) => (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-800 dark:text-white">Kids & Teens Resources</h1>
            <p className="mt-1 text-lg text-gray-500 dark:text-gray-400">Manage educational and fun content for our youth.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <div className="relative w-full flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input placeholder="Search resources..." className="pl-10 w-full h-10" onChange={(e) => onSearch(e.target.value)} />
            </div>
            <Button onClick={onAddNew} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"><PlusCircle className="mr-2 h-4 w-4" /> Add New</Button>
        </div>
    </div>
);

const ResourceGrid = ({ resources, onEdit, onDelete }: { resources: Resource[], onEdit: (resource: Resource) => void, onDelete: (id: string) => void }) => (
    <AnimatePresence>
        {resources.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {resources.map(resource => <ResourceCard key={resource.id} resource={resource} onEdit={onEdit} onDelete={onDelete} />)}
            </motion.div>
        ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-gray-100 dark:bg-gray-800/50 rounded-2xl">
                <Inbox className="mx-auto h-16 w-16 text-gray-400"/>
                <h3 className="mt-4 text-xl font-semibold">No Resources Found</h3>
                <p className="mt-1 text-gray-500">Add a new resource to get started!</p>
            </motion.div>
        )}
    </AnimatePresence>
);

const ResourceCard = ({ resource, onEdit, onDelete }: { resource: Resource, onEdit: (resource: Resource) => void, onDelete: (id: string) => void }) => {
    const config = typeConfig[resource.type] || typeConfig.default;
    return (
        <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative group">
            <div className={`absolute -inset-0.5 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 ${config.gradient.replace(/from-|via-|to-/g, (match) => {
                if (match === 'from-') return 'from-';
                if (match === 'via-') return 'via-';
                if (match === 'to-') return 'to-';
                return '';
            }).replace(/\/30/g, '/70').replace(/\/20/g, '/50').replace(/\/10/g, '/30')} animate-tilt`}></div>
            <Card className={`relative h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl dark:bg-gray-800 border dark:border-gray-700/60 overflow-hidden`}>
                <CardHeader className="p-0">
                    <div className={`aspect-video relative w-full bg-gradient-to-br ${config.gradient} rounded-t-2xl flex items-center justify-center`}>
                        {resource.url && resource.url.match(/\.(jpeg|jpg|png|gif|webp|svg)$/) ? 
                            <img src={resource.url} alt={resource.title} className="w-full h-full object-cover" /> : 
                            <config.icon className={`w-16 h-16 ${config.color} opacity-50`}/>}
                    </div>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                    <Badge variant="secondary" className={`mb-2 ${config.color} bg-opacity-20 border-0`}><config.icon className="w-3 h-3 mr-1.5"/>{resource.type}</Badge>
                    <CardTitle className="text-lg font-bold line-clamp-2">{resource.title}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 my-2 flex-grow">{resource.description}</p>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2 p-4 border-t dark:border-gray-700/60">
                    <div className="flex flex-wrap gap-2">
                        {resource.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>)}
                    </div>
                    <div className="flex justify-end gap-2 w-full mt-2">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(resource)}><Edit className="h-4 w-4 mr-1.5"/>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(resource.id)}><Trash2 className="h-4 w-4 mr-1.5"/>Delete</Button>
                        {resource.url && <a href={resource.url} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm"><ExternalLink className="h-4 w-4 mr-1.5"/>View</Button></a>}
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

const ResourceDialog = ({ isDialogOpen, resetFormAndCloseDialog, formState, setFormState, handleFormSubmit, isSubmitting, currentResource }: any) => (
    <Dialog open={isDialogOpen} onOpenChange={resetFormAndCloseDialog}>
        <DialogContent className="sm:max-w-lg w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <DialogHeader><DialogTitle className="text-2xl font-bold">{currentResource ? "Edit Resource" : "Add New Resource"}</DialogTitle></DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={formState.title} onChange={(e) => setFormState({ ...formState, title: e.target.value })} placeholder="Resource Title" required />
                </div>
                <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={formState.type} onValueChange={(value) => setFormState({ ...formState, type: value })} required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(typeConfig).filter(key => key !== 'default').map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="url">URL (Optional)</Label>
                    <Input id="url" value={formState.url} onChange={(e) => setFormState({ ...formState, url: e.target.value })} placeholder="e.g., YouTube link, image URL" />
                </div>
                <div>
                    <Label htmlFor="file">Upload File (Optional)</Label>
                    <Input id="file" type="file" onChange={(e) => setFormState({ ...formState, file: e.target.files ? e.target.files[0] : null })} />
                </div>
                <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input id="tags" value={formState.tags} onChange={(e) => setFormState({ ...formState, tags: e.target.value })} placeholder="e.g., fun, bible, craft" />
                </div>
                <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea id="description" value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} placeholder="Brief description of the resource" rows={4} />
                </div>
                <DialogFooter className="pt-4">
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white">{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
);

export default AdminKidsTeensResources;
