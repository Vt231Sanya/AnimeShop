import React, {useEffect, useState} from 'react';
import Header from "../components/Header";
import ProductCatalog from "../components/Product/ProductCatalog";
import Footer from "../components/Footer";
import {useSearchParams} from "react-router-dom";

const Catalog = ({filters, setFilters}) => {
    const styles = {
        page:  {
            backgroundColor: "#1f2937",
        },
    }
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('cat');
    useEffect(() => {
        if (categoryId && filters.categoryId !== categoryId) {
            setFilters((prev) => ({ ...prev, categoryId }));
        }
    }, [categoryId, filters.categoryId, setFilters]);
    return (
        <div style={styles.page}>
            <Header filters={filters} setFilters={setFilters} />
            <ProductCatalog filters={filters} setFilters={setFilters}/>
            <Footer />
        </div>
    );
};

export default Catalog;