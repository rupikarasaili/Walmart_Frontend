"use client";
import { UserProductList } from "@/components/products/UserProductList";
import { PageLayout } from "@/layout/pageLayout";

export default function Home() {
  return (
    <PageLayout>
      <UserProductList />
    </PageLayout>
  );
}
