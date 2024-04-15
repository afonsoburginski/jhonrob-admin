'use client'
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { db } from '../lib/firebase';
import { collection, doc, setDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, PlusCircle } from 'lucide-react';

export function MoviesModal() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [year, setYear] = useState("");
  const [rating, setRating] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const { toast } = useToast()

  const clearFields = () => {
    setTitle("");
    setSubtitle("");
    setYear("");
    setRating("");
    setPosterUrl("");
    setDescription("");
    setSelectedCategory("");
    setTrailerUrl("");
    setVideoUrl("");
  };
  
  const saveToFirestore = async () => {
    if (!selectedCategory || selectedCategory === "") {
      toast({
        title: "Erro!",
        description: "Por favor, selecione uma categoria.",
        variant: "destructive",
      });
      return;
    }
    try {
      const movieId = title.replace(/\s+/g, '-').toLowerCase();
      await setDoc(doc(db, "movies", movieId), {
        title,
        subtitle,
        year,
        rating,
        posterUrl,
        description,
        category: selectedCategory,
        trailerUrl,
        videoUrl
      });
      toast({
        title: "Sucesso!",
        description: (
          <div className="flex justify-between items-center">
            <span>
              O filme <strong className='text-blue-500'>{movieId}</strong> foi salvo com sucesso.
            </span>
            <CheckCircle className="ml-2 text-blue-500 " />
          </div>
        ),
      });
      clearFields();
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        title: "Erro!",
        description: "Ocorreu um erro ao salvar o filme.",
        variant: "destructive",
      });
    }
  };
  
  const categoryOptions = [
    { id: 'action', name: 'Action 🔫' },
    { id: 'adventure', name: 'Adventure 🗺️' },
    { id: 'animation', name: 'Animation 🧚' },
    { id: 'anime', name: 'Anime 🐲' },
    { id: 'classic', name: 'Classic 🎞️' },
    { id: 'comedy', name: 'Comedy 😄' },
    { id: 'documentary', name: 'Documentary 🎥' },
    { id: 'drama', name: 'Drama 😭' },
    { id: 'family', name: 'Family 👨‍👩‍👧‍👦' },
    { id: 'fantasy', name: 'Fantasy 🐉' },
    { id: 'horror', name: 'Horror 😱' },
    { id: 'kids', name: 'Kids 🧒' },
    { id: 'musical', name: 'Musical 🎵' },
    { id: 'mystery', name: 'Mystery 🕵️' },
    { id: 'romance', name: 'Romance 💖' },
    { id: 'sci-fi', name: 'Sci-Fi 🚀' },
    { id: 'sports', name: 'Sports ⚽' },
    { id: 'stand-up', name: 'Stand-Up Comedy 🎤' },
    { id: 'thriller', name: 'Thriller 🔍' },
    { id: 'tv-shows', name: 'TV Shows 📺' },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          <PlusCircle className="h-3.5 w-3.5 mr-2" />
          Add Movie
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add Movie</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para cadastrar um novo filme.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 grid-cols-1 md:grid-cols-8">
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Input id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="year">Ano</Label>
            <Input id="year" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label htmlFor="rating">Avaliação</Label>
            <Input id="rating" value={rating} onChange={(e) => setRating(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-8">
            <Label htmlFor="poster">Poster</Label>
            <Input id="poster" value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-8">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="categories">Categorias</Label>
            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={selectedCategory || "Selecione a categoria"} />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem 
                    key={category.id} 
                    value={category.id}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="trailerUrl">URL do Trailer</Label>
            <Input id="trailerUrl" value={trailerUrl} onChange={(e) => setTrailerUrl(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="videoUrl">URL do Vídeo</Label>
            <Input id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={saveToFirestore}>Salvar Filme</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}