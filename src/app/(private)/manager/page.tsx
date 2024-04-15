'use client'
import Image from "next/image"
import { unstable_noStore, revalidateTag } from "next/cache"
import { PlusCircle, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoviesModal } from "@/components/moviesModal"
import { SeriesModal } from "@/components/seriesModal"
import Header from "@/components/header"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

interface Movie {
  id: string;
  title?: string;
  subtitle?: string;
  year?: number;
  rating?: number;
  posterUrl?: string;
  description?: string;
  category?: string;
  trailerUrl?: string;
  videoUrl?: string;
}

interface Series {
  id: string;
  title?: string;
  subtitle?: string;
  year?: number;
  rating?: number;
  posterUrl?: string;
  description?: string;
  category?: string;
  trailerUrl?: string;
  videoUrl?: string;
}

export default function Manager() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Series[]>([]);

  useEffect(() => {
    const moviesCollection = collection(db, 'movies');
    const seriesCollection = collection(db, 'series');
    
    const unsubscribeMovies = onSnapshot(moviesCollection, (snapshot) => {
      const moviesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movie));
      setMovies(moviesData);
    });

    const unsubscribeSeries = onSnapshot(seriesCollection, (snapshot) => {
      const seriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Series));
      setSeries(seriesData);
    });

    return () => {
      unsubscribeMovies();
      unsubscribeSeries();
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="movies">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="movies">Movies</TabsTrigger>
                <TabsTrigger value="series">Series</TabsTrigger>
              </TabsList>
              <TabsContent className="mt-0" value="movies">
                <MoviesModal />
              </TabsContent>
              <TabsContent className="mt-0" value="series">
                <SeriesModal />
              </TabsContent>
            </div>
            <TabsContent value="movies">
              <Card x-chunk="dashboard-06-chunk-1">
                <CardHeader>
                  <CardTitle>Movies</CardTitle>
                  <CardDescription>
                    Manage your movies and view their details.
                  </CardDescription>
                </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="hidden w-auto sm:table-cell">Poster</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Subtitle</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Categories</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {movies.map((movie, index) => (
                          <TableRow key={movie.id}>
                            <TableCell className="hidden w-auto sm:table-cell">
                              <Image
                                alt="Movie poster"
                                className="aspect-square rounded-md object-cover"
                                height="54"
                                width="54"
                                src={movie.posterUrl || '/placeholder.png'}
                              />
                            </TableCell>
                            <TableCell className="font-medium w-auto">{movie.title}</TableCell>
                            <TableCell className="w-auto">{movie.subtitle}</TableCell>
                            <TableCell className="w-auto">{movie.year}</TableCell>
                            <TableCell className="w-auto"><Badge variant="default">{movie.rating}</Badge></TableCell>
                            <TableCell className="w-auto">{movie.description}</TableCell>
                            <TableCell className="w-auto"><Badge variant="default">{movie.category}</Badge></TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                    products
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="series">
              <Card x-chunk="dashboard-06-chunk-1">
                <CardHeader>
                  <CardTitle>Series</CardTitle>
                  <CardDescription>
                    Manage your series and view their details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-auto sm:table-cell">Poster</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Subtitle</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Categories</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {series.map((movie, index) => (
                        <TableRow key={movie.id}>
                          <TableCell className="hidden sm:table-cell">
                          <Image
                            alt="Movie poster"
                            className="aspect-square rounded-md object-cover"
                            height="54"
                            width="54"
                            src={movie.posterUrl || '/placeholder.png'}
                          />
                          </TableCell>
                          <TableCell className="font-medium w-auto">{movie.title}</TableCell>
                          <TableCell className="w-auto">{movie.subtitle}</TableCell>
                          <TableCell className="w-auto">{movie.year}</TableCell>
                          <TableCell className="w-auto"><Badge variant="default">{movie.rating}</Badge></TableCell>
                          <TableCell className="w-auto">{movie.description}</TableCell>
                          <TableCell className="w-auto"><Badge variant="default">{movie.category}</Badge></TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                    products
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}