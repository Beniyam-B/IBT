import { notFound } from "next/navigation";

export default function DishPage({ params }) {
    const { id } = params;
    return <h1>{id}</h1>;
}