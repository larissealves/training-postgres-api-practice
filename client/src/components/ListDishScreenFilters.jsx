import React, { useState, useEffect } from "react";

export default function ListDishScreenFilters() {
    const ENDPOINT = 'http://localhost:3000/api/';
    
    const [listDish, setListDish] = useState([]);
    const [listTags, setListTags] = useState([]);
    const [listIngredients, setListIngredients] = useState([]);
    const [listCategories, setListCategories] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [paginationTotalPages, setPaginationTotalPages] = useState(0);
    const PAGINATION_LIMIT = 4;


    const [loading, setLoading] = useState(false);


    const [filters, setFilters] = useState({
        tags: [],
        ingredients: [],
        category: '',
        name: '',
    });

    const fetchDropdowns = async () => {
        try {
            const [tags, ingredients, categories] = await Promise.all([
                fetch(`${ENDPOINT}tags`),
                fetch(`${ENDPOINT}ingredients`),
                fetch(`${ENDPOINT}categories`),
            ]);

            const dataTags = await tags.json();
            const dataIngredients = await ingredients.json();
            const dataCategories = await categories.json();

            setListTags(dataTags.data);
            setListIngredients(dataIngredients.data);
            setListCategories(dataCategories.data);

        } catch (error) {
            console.log("Erro ao carregar os dados dos dropdowns!");
        }
    };

    const fetchDishes = async () => {
        try {
            setLoading(true);
            const filterByName = !filters.name.trim() ? '' : filters.name;
            const filterByTags = filters.tags?.length && filters.tags[0] > 0 ? filters.tags.join(",") : '';
            const filterByingredients = filters.ingredients?.length && filters.ingredients[0] > 0 ? filters.ingredients.join(",") : '';

            const [dataListDish] = await Promise.all([
                fetch(`${ENDPOINT}dishes?tags=${filterByTags}&ingredients=${filterByingredients}&category=${filters.category}&name=${filterByName}&currentPage=${currentPage}&limit=${PAGINATION_LIMIT}`),
            ]);
            const data = await dataListDish.json();
            console.log(data);
            setListDish(data.data);
            setCurrentPage(data.pagination.currentPage);
            setPaginationTotalPages(data.pagination.totalPages);

        } catch (error) {
            console.log("Erro ao carregar a lista de pratos!");
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDropdowns();
    }, []);


    useEffect(() => {
        fetchDishes();
    }, []);


    const newList = listDish.filter((item) => {
        const name  = !filters.name || item.dishName?.toLowerCase().includes(filters.name?.toLowerCase())
        const category = !filters.category || item.categoryName?.toLowerCase().includes(filters.category?.toLowerCase())
        const tags = !filters.tags?.length || filters.tags.some((itemTag) => item.tagsname?.includes(itemTag))
        const ingredients = !filters.ingredients?.length || filters.ingredients.some((itemIng) => item.listIngredients?.includes(itemIng))
        return name && category && tags && ingredients;
    } );


    return (

        <div className="min-h-screen bg-gray-100 p-3 sm:p-4">

            {/* ================= FILTROS ================= */}
            <section className="mx-auto mb-5 max-w-6xl rounded-xl bg-white p-4 shadow-sm">

                <div className="mb-3">
                    <h2 className="text-base font-bold text-gray-800">
                        Filtrar pratos
                    </h2>

                    <p className="mt-0.5 text-xs text-gray-500">
                        Use os filtros para encontrar um prato.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">

                    {/* Nome */}
                    <div>
                        <label
                            htmlFor="name-filter"
                            className="mb-1 block text-xs font-semibold text-gray-700"
                        >
                            Nome
                        </label>

                        <div className="relative">
                            <input
                                id="name-filter"
                                type="text"
                                value={filters.name}
                                disabled={loading}
                                onChange={(e) => {setFilters({...filters, name: e.target.value})}}

                                placeholder="Buscar por nome..."
                                className="w-full rounded-md border border-gray-300 
                                py-2 pl-3 pr-10 text-sm text-gray-700 outline-none 
                                transition placeholder:text-gray-400 focus:border-gray-500 
                                focus:ring-1 focus:ring-gray-200"
                            />

                           {/*} <button
                                type="button"
                                disabled={loading || !filterName}
                                title="Digite o nome e clique para buscar"
                                onClick={filterByName}
                                className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 
                                items-center justify-center rounded-md 
                                text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 
                                disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer "
                                aria-label="Pesquisar"
                            >
                                🔍
                            </button>*/}
                        </div>
                    </div>

                    {/* Categoria */}
                    <div>
                        <label
                            htmlFor="category-filter"
                            className="mb-1 block text-xs font-semibold text-gray-700"
                        >
                            Categoria
                        </label>

                        <select
                            id="category-filter"
                            value={filters.category ?? ""}
                            disabled={loading}
                            onChange={(e) => {
                                setFilters((prev) => ({
                                    ...prev,
                                    category: e.target.value,
                                }));

                                setCurrentPage(1);
                            }}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-200"
                        >
                            <option value="">
                                Todas as categorias
                            </option>

                            {listCategories.map((item) => (
                                <option key={item.id} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tags */}
                    <div>
                        <label
                            htmlFor="tag-filter"
                            className="mb-1 block text-xs font-semibold text-gray-700"
                        >
                            Tags
                        </label>

                        <select
                            id="tag-filter"
                            multiple
                            value={filters.tags ?? []}
                            disabled={loading}
                            onChange={(e) => {
                                const selectedTags = Array.from(
                                    e.target.selectedOptions,
                                    (option) => option.value
                                );

                                setFilters((prev) => ({
                                    ...prev,
                                    tags: selectedTags,
                                }));

                                setCurrentPage(1);
                            }}
                            className="h-20 w-full rounded-md border border-gray-300 bg-white p-1.5 text-sm text-gray-700 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-200"
                        >
                            {listTags.map((item) => (
                                <option key={item.id} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ingredientes */}
                    <div>
                        <label
                            htmlFor="ingredient-filter"
                            className="mb-1 block text-xs font-semibold text-gray-700"
                        >
                            Ingredientes
                        </label>

                        <select
                            id="ingredient-filter"
                            multiple
                            value={filters.ingredients ?? []}
                            disabled={loading}
                            onChange={(e) => {
                                const selectedIngredients = Array.from(
                                    e.target.selectedOptions,
                                    (option) => option.value
                                );

                                setFilters((prev) => ({
                                    ...prev,
                                    ingredients: selectedIngredients,
                                }));

                                setCurrentPage(1);
                            }}
                            className="h-20 w-full rounded-md border border-gray-300 bg-white p-1.5 text-sm text-gray-700 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-200"
                        >
                            {listIngredients.map((item) => (
                                <option key={item.id} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Limpar */}
                {(filters.name || 
                    filters.category ||
                    filters.tags?.length ||
                    filters.ingredients?.length) ? (
                    <div className="mt-3 flex justify-end">
                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => {
                                setFilters({
                                    name: "",
                                    tags: [],
                                    ingredients: [],
                                    category: "",
                                });
                                setCurrentPage(1);
                            }}
                            className="rounded-md border border-gray-300 px-3 
                            py-1.5 text-xs font-medium text-gray-600 
                            transition hover:bg-gray-50 cursor-pointer"
                        >
                            Limpar filtros
                        </button>
                    </div>
                ) : null}
            </section>


            {/* ================= LISTA ================= */}
            <section className="mx-auto grid max-w-6xl gap-4 grid-cols-2 lg:grid-cols-4">

                {newList.length > 0 ? (
                    newList.map((item) => (
                        <article
                            key={item.id}
                            className="flex flex-col rounded-xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >

                            {/* Nome */}
                            <div className="mb-3 border-b border-gray-100 pb-2">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                    Nome
                                </p>

                                <h3 className="mt-0.5 break-words text-base font-bold text-gray-800">
                                    {item.dishName}
                                </h3>
                            </div>

                            {/* Descrição */}
                            <div className="mb-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                    Descrição
                                </p>

                                <p className="mt-0.5 line-clamp-2 break-words text-xs leading-relaxed text-gray-600">
                                    {item.description}
                                </p>
                            </div>

                            {/* Preço + Data */}
                            <div className="mb-3 grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                        Preço
                                    </p>

                                    <p className="mt-0.5 text-sm font-semibold text-gray-800">
                                        R$ {item.price}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                        Criado em
                                    </p>

                                    <p className="mt-0.5 text-xs text-gray-600">
                                        {new Date(
                                            item.dishcreatedat
                                        ).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                            </div>

                            {/* Categoria */}
                            <div className="mb-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                    Categoria
                                </p>

                                <span className="mt-1 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                    {item.categoryName}
                                </span>
                            </div>

                            {/* Tags */}
                            <div className="mb-3">
                                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                    Tags
                                </p>

                                <div className="flex flex-wrap gap-1">
                                    {item.tagsname?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-white"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Ingredientes */}
                            <div className="mb-3">
                                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                    Ingredientes
                                </p>

                                <div className="flex flex-wrap gap-1">
                                    {item.ingredientsname?.map(
                                        (ingredient, index) => (
                                            <span
                                                key={index}
                                                className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] text-gray-600"
                                            >
                                                {ingredient}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Imagens */}
                            <div className="mt-auto">
                                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                    Imagens
                                </p>

                                <div className="flex h-28 items-center justify-center overflow-hidden rounded-md bg-gray-50 w-30 object-cover">
                                    {item.listImages?.length > 0 ? (
                                        item.listImages.map((img, index) => (

                                            <img
                                                src={img}
                                                alt={`${item.dishName} - imagem ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />

                                        ))
                                    ) : (
                                        <span className="text-xs text-gray-400">
                                            Sem imagem
                                        </span>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="col-span-full rounded-xl bg-white px-4 py-10 text-center shadow-sm">
                        <p className="text-base font-semibold text-gray-700">
                            Nenhum prato encontrado
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            Tente alterar os filtros da pesquisa.
                        </p>
                    </div>
                )}
            </section>


            {/* ================= PAGINAÇÃO ================= */}
            <div className="mx-auto mt-5 flex max-w-6xl items-center justify-center gap-2">

                <button
                    type="button"
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1 || loading}
                    className="rounded-md border border-gray-300 bg-white px-3 
                    py-1.5 text-xs font-medium text-gray-700 transition 
                    hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer "
                >
                    ← Anterior
                </button>

                <div className="rounded-md bg-white px-3 py-1.5 text-xs 
                font-medium text-gray-700 shadow-sm">
                    {currentPage} / {paginationTotalPages}
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setCurrentPage((prev) =>
                            Math.min(prev + 1, paginationTotalPages)
                        )
                    }
                    disabled={
                        currentPage === paginationTotalPages ||
                        paginationTotalPages === 0 ||
                        loading
                    }
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 
                    text-xs font-medium text-gray-700 transition hover:bg-gray-50 
                    disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer "
                >
                    Próxima →
                </button>
            </div>
        </div>

    );
}
