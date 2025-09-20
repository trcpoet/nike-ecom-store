// products.ts
import postgres from "postgres";
import { JSX } from "react";
// Define the type for Product if you're using TypeScript
type ProductData = {
    id: number;
    name: string;
    image_url?: string;
    description?: JSX.Element;
    price: number;
};

// Define the ProductName class
export class ProductName {
    constructor(public value: string) {}
}

// Define the Product class
export class Product {
    id: number;
    name: ProductName;
    image_url?: string;
    description?: JSX.Element;
    price: number;

    constructor(data: ProductData) {
        this.id = data.id;
        this.name = new ProductName(data.name);
        this.image_url = data.image_url;
        this.description = data.description;
        this.price = data.price;
    }
}

// Sample function that fetches products from the database
export async function products(): Promise<Product[]> {
    const sql = postgres(); // Initialize your postgres connection

    // Fetch products from the database
    const productData: ProductData[] = await sql`
        SELECT id, name, image_url, description, price FROM products
    `;

    // Map the fetched data to Product instances
    return productData.map(data => new Product(data));
}
