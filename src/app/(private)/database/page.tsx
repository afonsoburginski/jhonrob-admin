'use client'
import React, { useEffect, useState } from "react"
import { PlusCircle, MoreHorizontal } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { db } from '@/lib/firebase';
import { collection, getDocs, onSnapshot, DocumentData } from 'firebase/firestore';

export default function Database() {
  const [movies, setMovies] = useState<DocumentData[]>([]);
  const [series, setSeries] = useState<DocumentData[]>([]);

  useEffect(() => {
    const cachedMovies = localStorage.getItem('movies');
    const cachedSeries = localStorage.getItem('series');

    if (cachedMovies && cachedSeries) {
      setMovies(JSON.parse(cachedMovies));
      setSeries(JSON.parse(cachedSeries));
    } else {
      const unsubscribeMovies = onSnapshot(collection(db, 'movies'), (snapshot) => {
        const moviesData = snapshot.docs.map(doc => doc.data());
        setMovies(moviesData);
        localStorage.setItem('movies', JSON.stringify(moviesData));
      });

      const unsubscribeSeries = onSnapshot(collection(db, 'series'), (snapshot) => {
        const seriesData = snapshot.docs.map(doc => doc.data());
        setSeries(seriesData);
        localStorage.setItem('series', JSON.stringify(seriesData));
      });

      return () => {
        unsubscribeMovies();
        unsubscribeSeries();
      }
    }
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
            </div>
            <TabsContent value="movies">
                <Card x-chunk="dashboard-06-chunk-1" className="max-w-full overflow-auto">
                  <CardHeader>
                    <CardTitle>Movies</CardTitle>
                    <CardDescription>
                      Visualize the database structure of your movies.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <div className="overflow-x-auto">
                      <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap">{JSON.stringify(movies, null, 2)}</pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="series">
                <Card x-chunk="dashboard-06-chunk-1" className="max-w-full overflow-auto">
                  <CardHeader>
                    <CardTitle>Series</CardTitle>
                    <CardDescription>
                      Visualize the database structure of your series.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    <div className="overflow-x-auto">
                      <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap">{JSON.stringify(series, null, 2)}</pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}