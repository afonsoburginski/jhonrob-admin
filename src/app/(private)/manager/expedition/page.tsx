'use client'
import React, {useState} from 'react';
import { ExpeditionTable } from './ExpeditionTable';
import Settings from './settings';
import Romaneio from './Romaneio';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Expedition() {
  return (
    <div className="flex h-full w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="of">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="of">Embarque</TabsTrigger>
                <TabsTrigger value="expedition">Expedição</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="of" className="flex flex-row justify-around gap-8">
              <Card x-chunk="dashboard-06-chunk-1" className="flex-grow">
                <CardHeader>
                  <CardTitle>Embarque</CardTitle>
                  <CardDescription>
                    Selecione a OF e os itens que serão embarcados
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Settings />
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Mostrando <strong>1-10</strong> de <strong>32</strong>{" "}
                    OFs
                  </div>
                </CardFooter>
              </Card>
              <Romaneio/>
            </TabsContent>
            <TabsContent value="expedition">
              <Card x-chunk="dashboard-06-chunk-1">
                <CardHeader>
                  <CardTitle>Expedição</CardTitle>
                  <CardDescription>
                    Lista de itens enviados para expedição
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <ExpeditionTable />
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                  <div className="text-xs text-muted-foreground">
                    Mostrando <strong>1-10</strong> de <strong>32</strong>{" "}
                    itens
                  </div>
                <Pagination className="ml-auto mr-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span className="sr-only">Previous Order</span>
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="sr-only">Next Order</span>
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}