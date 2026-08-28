import React, { useState, useEffect } from "react";

export function ListDish() {

    const [listDish, setListDish] = useState([]);
    const [listTags, setListTags] = useState([]);
    const [listIngredients, setListIngredients] = useState([]);
    const [listCategories, setListCategories] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [paginationTotalPages, setPaginationTotalPages] = useState(0);
    const PAGINATION_LIMIT = 4;

    const [messageAlert, setMessageAlert] = useState('');
    const [loading, setLoading] = useState(false);

    const [formDish, setFormDish] = useState({
        name: "",
        price: "",
        description: "",
        categoryId: '',
        isActive: true,
        tagsId: [],
        ingredientsId: [],
    });

    const [filters, setFilters] = useState({
        tags: [],
        ingredients: [],
        category: '',
        name: '',
    });

    const fetchDropdowns = async () => {
        try {
            const [tags, ingredients, categories] = await Promise.all([
                fetch(`http://127.0.0.1:3000/api/tags`),
                fetch(`http://127.0.0.1:3000/api/ingredients`),
                fetch(`http://127.0.0.1:3000/api/categories`),
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
            const filterByName = !filters.name.trim() ? '' : filters.name;
            const filterByTags = filters.tags?.length && filters.tags[0] > 0 ? filters.tags.join(",") : '';
            const filterByingredients = filters.ingredients?.length && filters.ingredients[0] > 0 ? filters.ingredients.join(",") : '';

            const [dataListDish] = await Promise.all([
                fetch(`http://127.0.0.1:3000/api/dishes?tags=${filterByTags}&ingredients=${filterByingredients}&category=${filters.category}&name=${filterByName}&currentPage=${currentPage}&limit=${PAGINATION_LIMIT}`),
            ]);
            const data = await dataListDish.json();

            setListDish(data.data);
            setCurrentPage(data.pagination.currentPage);
            setPaginationTotalPages(data.pagination.totalPages);

        } catch (error) {
            console.log("Erro ao carregar a lista de pratos!");
        }
    };


    const handleSubmit = async () => {
        setLoading(true);
        setMessageAlert("");

        if (!formDish.name.trim() ||
            !formDish.description.trim() ||
            !formDish.price ||
            !formDish.categoryId) {
            setMessageAlert("Nome, preço, descrição e categoria são obrigatórios");
            setLoading(false);
            return null;
        }
        const formData = new FormData();

        formData.append('name', formDish.name);
        formData.append("price", formDish.price);
        formData.append("description", formDish.description);
        formData.append('categoryId', formDish.categoryId);
        formData.append('isActive', formDish.isActive);
        formData.append("tagsId", JSON.stringify(formDish.tagsId));
        formData.append('ingredientsId', JSON.stringify(formDish.ingredientsId));

        console.log(formData);
        try {
            const res = await fetch(`
                http://127.0.0.1:3000/api/dish`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            //fetchDishes();
            console.log(formData);

            clearForm();

        } catch (error) {
            setMessageAlert("erro aos salvar o prato");
            console.log("erro aos salvar o prato", error);
        } finally {
            setLoading(false);
        }
    };

    const clearForm = () => setFormDish({
        name: "",
        price: '',
        description: "",
        categoryId: '',
        isActive: true,
        tagsId: [],
        ingredientsId: [],
    });

    useEffect(() => {
        fetchDropdowns();
    }, []);

    useEffect(() => {
        fetchDishes();
    }, [filters, currentPage, paginationTotalPages]);


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* ============= START FORM ============= */}
            <form
                onSubmit={handleSubmit}
                className="mx-auto mb-8 max-w-4xl rounded-2xl bg-white p-6 shadow-md"
            >
                {/* Header */}
                <div className="mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Cadastrar prato
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Preencha as informações do prato abaixo.
                    </p>
                </div>

                {/* Nome + Preço */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    {/* Nome */}
                    <div>
                        <label
                            htmlFor="dish-name"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Nome
                        </label>

                        <input
                            id="dish-name"
                            type="text"
                            disabled={loading}
                            value={formDish.name ?? ""}
                            placeholder="Ex.: Pizza Margherita"
                            onChange={(e) =>
                                setFormDish((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                        />
                    </div>

                    {/* Preço */}
                    <div>
                        <label
                            htmlFor="dish-price"
                            disabled={loading}
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Preço
                        </label>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                R$
                            </span>

                            <input
                                id="dish-price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formDish.price ?? ""}
                                placeholder="0,00"
                                disabled={loading}
                                onChange={(e) =>
                                    setFormDish((prev) => ({
                                        ...prev,
                                        price: e.target.value,
                                    }))
                                }
                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Descrição */}
                <div className="mt-5">
                    <label
                        htmlFor="dish-description"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                        Descrição
                    </label>

                    <textarea
                        id="dish-description"
                        rows={4}
                        value={formDish.description ?? ""}
                        disabled={loading}
                        placeholder="Descreva os ingredientes e características do prato..."
                        onChange={(e) =>
                            setFormDish((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    />
                </div>

                {/* Categoria */}
                <div className="mt-5">
                    <label
                        htmlFor="dish-category"
                        className="mb-2 block text-sm font-semibold text-gray-700"
                    >
                        Categoria
                    </label>

                    <select
                        id="dish-category"
                        value={formDish.categoryId ?? ""}
                        disabled={loading}
                        onChange={(e) =>
                            setFormDish((prev) => ({
                                ...prev,
                                categoryId: e.target.value,
                            }))
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                    >
                        <option value="">
                            Selecione uma categoria
                        </option>

                        {listCategories.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tags + Ingredientes */}
                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

                    {/* Tags */}
                    <div>
                        <label
                            htmlFor="dish-tags"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Tags
                        </label>

                        <select
                            id="dish-tags"
                            multiple
                            value={formDish.tagsId ?? []}
                            disabled={loading}
                            onChange={(e) =>
                                setFormDish((prev) => ({
                                    ...prev,
                                    tagsId: Array.from(
                                        e.target.selectedOptions,
                                        (option) => Number(option.value)
                                    ),
                                }))
                            }
                            className="h-40 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                        >
                            {listTags.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                    className="rounded px-2 py-1"
                                >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <p className="mt-1 text-xs text-gray-400">
                            Segure Ctrl/Cmd para selecionar várias.
                        </p>
                    </div>

                    {/* Ingredientes */}
                    <div>
                        <label
                            htmlFor="dish-ingredients"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Ingredientes
                        </label>

                        <select
                            id="dish-ingredients"
                            multiple
                            value={formDish.ingredientsId ?? []}
                            disabled={loading}
                            onChange={(e) =>
                                setFormDish((prev) => ({
                                    ...prev,
                                    ingredientsId: Array.from(
                                        e.target.selectedOptions,
                                        (option) => Number(option.value)
                                    ),
                                }))
                            }
                            className="h-40 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                        >
                            {listIngredients.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                    className="rounded px-2 py-1"
                                >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <p className="mt-1 text-xs text-gray-400">
                            Segure Ctrl/Cmd para selecionar várias.
                        </p>
                    </div>
                </div>

                {/* Status */}
                <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 p-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-700">
                            Prato ativo
                        </p>

                        <p className="text-xs text-gray-500">
                            Define se o prato ficará disponível.
                        </p>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                        <input
                            type="checkbox"
                            checked={formDish.isActive}
                            disabled={loading}
                            onChange={(e) =>
                                setFormDish((prev) => ({
                                    ...prev,
                                    isActive: e.target.checked,
                                }))
                            }
                            className="peer sr-only"
                        />

                        <div className="h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                </div>

                {/* Mensagem */}
                {messageAlert && (
                    <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {messageAlert}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-gray-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Salvando..." : "Salvar prato"}
                    </button>
                </div>
            </form>
            {/* ============= END FORM ============= */}

            
            {/* ================= FILTROS ================= */}
            <section className="mx-auto mb-8 max-w-6xl rounded-2xl bg-white p-6 shadow-sm">

                <div className="mb-5">
                    <h2 className="text-lg font-bold text-gray-800">
                        Filtrar pratos
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Use os filtros abaixo para encontrar um prato.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

                    {/* Nome */}
                    <div>
                        <label
                            htmlFor="name-filter"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Nome
                        </label>

                        <input
                            id="name-filter"
                            type="text"
                            value={filters.name ?? ""}
                            disabled={loading}
                            onChange={(e) => {
                                setFilters((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }));

                                setCurrentPage(1);
                            }}
                            placeholder="Buscar por nome..."
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                        />
                    </div>

                    {/* Categoria */}
                    <div>
                        <label
                            htmlFor="category-filter"
                            className="mb-2 block text-sm font-semibold text-gray-700"
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
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                        >
                            <option value="">
                                Todas as categorias
                            </option>

                            {listCategories.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tags */}
                    <div>
                        <label
                            htmlFor="tag-filter"
                            className="mb-2 block text-sm font-semibold text-gray-700"
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
                                    (option) => Number(option.value)
                                );

                                setFilters((prev) => ({
                                    ...prev,
                                    tags: selectedTags,
                                }));

                                setCurrentPage(1);
                            }}
                            className="h-28 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                        >
                            {listTags.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                    className="rounded px-2 py-1"
                                >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <p className="mt-1 text-xs text-gray-400">
                            Selecione uma ou mais tags.
                        </p>
                    </div>

                    {/* Ingredientes */}
                    <div>
                        <label
                            htmlFor="ingredient-filter"
                            className="mb-2 block text-sm font-semibold text-gray-700"
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
                                    (option) => Number(option.value)
                                );

                                setFilters((prev) => ({
                                    ...prev,
                                    ingredients: selectedIngredients,
                                }));

                                setCurrentPage(1);
                            }}
                            className="h-28 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-700 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                        >
                            {listIngredients.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.id}
                                    className="rounded px-2 py-1"
                                >
                                    {item.name}
                                </option>
                            ))}
                        </select>

                        <p className="mt-1 text-xs text-gray-400">
                            Selecione um ou mais ingredientes.
                        </p>
                    </div>
                </div>

                {/* Limpar filtros */}
                {(filters.name ||
                    filters.category ||
                    filters.tags?.length ||
                    filters.ingredients?.length) ? (
                    <div className="mt-5 flex justify-end">
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
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                        >
                            Limpar filtros
                        </button>
                    </div>
                ) : null}
            </section>


            {/* ================= LISTA DE PRATOS ================= */}
            <section className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">

                {listDish.length > 0 ? (
                    listDish.map((item) => (
                        <article
                            key={item.id}
                            className="flex flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >

                            {/* Nome */}
                            <div className="mb-5 border-b border-gray-100 pb-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Nome
                                </p>

                                <h3 className="mt-1 break-words text-xl font-bold text-gray-800">
                                    {item.dishName}
                                </h3>
                            </div>

                            {/* Descrição */}
                            <div className="mb-5">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Descrição
                                </p>

                                <p className="mt-1 break-words text-sm leading-relaxed text-gray-600">
                                    {item.description}
                                </p>
                            </div>

                            {/* Preço + Data */}
                            <div className="mb-5 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Preço
                                    </p>

                                    <p className="mt-1 font-semibold text-gray-800">
                                        R$ {item.price}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Criado em
                                    </p>

                                    <p className="mt-1 text-sm text-gray-600">
                                        {new Date(
                                            item.dishcreatedat
                                        ).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                            </div>

                            {/* Categoria */}
                            <div className="mb-5">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Categoria
                                </p>

                                <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                                    {item.categoryName}
                                </span>
                            </div>

                            {/* Tags */}
                            <div className="mb-5">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Tags
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {item.tagsname?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-white"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Ingredientes */}
                            <div className="mb-5">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Ingredientes
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {item.ingredientsname?.map(
                                        (ingredient, index) => (
                                            <span
                                                key={index}
                                                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600"
                                            >
                                                {ingredient}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Imagens */}
                            <div className="mt-auto">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Imagens
                                </p>

                                <div className="flex h-32 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-400">
                                    Imagens aqui
                                </div>
                            </div>
                        </article>
                    ))
                ) : (
                    <div className="col-span-full rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
                        <p className="text-lg font-semibold text-gray-700">
                            Nenhum prato encontrado
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                            Tente alterar os filtros da pesquisa.
                        </p>
                    </div>
                )}
            </section>


            {/* ================= PAGINAÇÃO ================= */}
            <div className="mx-auto mt-8 flex max-w-6xl items-center justify-center gap-4">

                <button
                    type="button"
                    onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1 || loading}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    ← Anterior
                </button>

                <div className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                    Página {currentPage} de {paginationTotalPages}
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
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Próxima →
                </button>
            </div>
        </div>
    );
}
