import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";

import { useAuth } from "../hooks/context/AuthContext.jsx";

import Login from './login/form.jsx';
import ListDishPDF from './ListDishPDF.jsx';

export default function ListDish() {
    const ENDPOINT = 'http://localhost:3000/api/';

    const { user } = useAuth();
    
    const [listDish, setListDish] = useState([]);
    const [listTags, setListTags] = useState([]);
    const [listIngredients, setListIngredients] = useState([]);
    const [listCategories, setListCategories] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [paginationTotalPages, setPaginationTotalPages] = useState(0);
    const PAGINATION_LIMIT = 4;

    const [messageAlert, setMessageAlert] = useState({
        message: "",
        type: "alert", //alert, error, success
    });

    const [showForm, setShowForm] = useState(false);
    const [showContent, setShowContent] = useState(false);
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

    const [filterName, setFilterName] = useState();


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
            const filterByName = !filters.name.trim() ? '' : filters.name;
            const filterByTags = filters.tags?.length && filters.tags[0] > 0 ? filters.tags.join(",") : '';
            const filterByingredients = filters.ingredients?.length && filters.ingredients[0] > 0 ? filters.ingredients.join(",") : '';

            const [dataListDish] = await Promise.all([
                fetch(`${ENDPOINT}dishes?tags=${filterByTags}&ingredients=${filterByingredients}&category=${filters.category}&name=${filterByName}&currentPage=${currentPage}&limit=${PAGINATION_LIMIT}`),
            ]);
            const data = await dataListDish.json();
            setListDish(data.data);
            setCurrentPage(data.pagination.currentPage);
            setPaginationTotalPages(data.pagination.totalPages);

        } catch (error) {
            console.log("Erro ao carregar a lista de pratos!");
        }
    };

    const checkForm = () => {
        if (!formDish.name.trim() ||
            !formDish.description.trim() ||
            !formDish.price ||
            !formDish.categoryId) {
            setMessageAlert({ message: 'Nome, preço, descrição e categoria são obrigatórios', type: 'error' });
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

        return formData;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setMessageAlert({ message: "", type: "" });
        const form = checkForm();

        if (!form) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`
                http://localhost:3000/api/dishes`,
                {
                    method: "POST",
                    body: form,
                }
            );

            if (!res.ok) {
                setMessageAlert({ message: 'Error ao salvar o prato', type: 'error' });
            }

            setMessageAlert({ message: 'SUCCESS', type: 'success' });
            fetchDishes();
            clearForm();

        } catch (error) {
            setMessageAlert({ message: 'Error ao salvar o prato', type: 'error' });
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

    const filterByName = () => {
        setFilters({ ...filters, name: filterName });
        setCurrentPage(1);
    }

    const testeLogin = async () => {
        const api = await fetch(`http://localhost:3000/api/login?userName=${'larisse'}&userPassword=${'larisse'}`)
    };

    useEffect(() => {
        fetchDropdowns();
        testeLogin();
    }, []);

    useEffect(() => {
        if (!messageAlert) return;

        setShowContent(true);

        const timer = setTimeout(() => {
            setShowContent(false);
            setMessageAlert("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [messageAlert]);

    useEffect(() => {
        fetchDishes();
    }, [filters, currentPage, paginationTotalPages]);


    return (

        <div className="min-h-screen bg-gray-100 p-3 sm:p-4">
            {!user ?  (<Login />) : `${user}`}
            {/* ================= BOTÃO FORM ================= */}
            <div className="mx-auto mb-3 flex  justify-end gap-4">
                <button
                    type="button"
                    onClick={() => setShowForm((prev) => !prev)}
                    className="rounded-md bg-gray-800 px-4 py-2 text-xs font-semibold text-white transition 
                    hover:bg-gray-700 cursor-pointer "
                >
                    {showForm ? "Esconder formulário" : "+ Adicionar prato"}
                </button>

                <PDFDownloadLink
                    document={<ListDishPDF listItems={listDish} />}
                    fileName="lista-de-pratos.pdf"
                >
                    {({ loading }) => (
                        <button
                            type="button"
                            disabled={loading}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm cursor-pointer
                            font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            {loading
                                ? "Gerando PDF..."
                                : "Baixar PDF"}
                        </button>
                    )}
                </PDFDownloadLink>

                {/*<Link
                    to="/screenFilters"
                    className="group px-4 py-2 rounded-full bg-violet-100 text-violet-700 font-semibold text-sm hover:bg-violet-200 transition"
                >
                    ⚙ Screen Filters
                    <span className="ml-1 transition-transform group-hover:translate-x-1 inline-block">
                        →
                    </span>
                </Link>*/}

            </div>

            {/* ================= FORM ================= */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto mb-5 max-w-4xl rounded-xl bg-white p-4 shadow-sm"
                >
                    {/* Header */}
                    <div className="mb-4 border-b border-gray-100 pb-3">
                        <h2 className="text-xl font-bold text-gray-800">
                            Cadastrar prato
                        </h2>

                        <p className="mt-0.5 text-xs text-gray-500">
                            Preencha as informações do prato abaixo.
                        </p>
                    </div>

                    {/* Nome + Preço */}
                    <div className="grid grid-cols-3 gap-3 md:grid-cols-3">

                        {/* Nome */}
                        <div>
                            <label
                                htmlFor="dish-name"
                                className="mb-1 block text-xs font-semibold text-gray-700"
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
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-200"
                            />
                        </div>

                        {/* Preço */}
                        <div>
                            <label
                                htmlFor="dish-price"
                                className="mb-1 block text-xs font-semibold text-gray-700"
                            >
                                Preço
                            </label>

                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
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
                                    className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-200"
                                />
                            </div>
                        </div>


                        {/* Categoria */}
                        <div className="">
                            <label
                                htmlFor="dish-category"
                                className="mb-1 block text-xs font-semibold text-gray-700"
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
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-200"
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
                    </div>

                    {/* Descrição */}
                    <div className="mt-3">
                        <label
                            htmlFor="dish-description"
                            className="mb-1 block text-xs font-semibold text-gray-700"
                        >
                            Descrição
                        </label>

                        <textarea
                            id="dish-description"
                            rows={2}
                            value={formDish.description ?? ""}
                            disabled={loading}
                            placeholder="Descreva os ingredientes e características do prato..."
                            onChange={(e) =>
                                setFormDish((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-200"
                        />
                    </div>


                    {/* Tags + Ingredientes */}
                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">

                        {/* Tags */}
                        <div>
                            <label
                                htmlFor="dish-tags"
                                className="mb-1 block text-xs font-semibold text-gray-700"
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
                                className="h-24 w-full rounded-md border border-gray-300 bg-white p-1.5 text-sm text-gray-700 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-200"
                            >
                                {listTags.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>

                            <p className="mt-1 text-[11px] text-gray-400">
                                Ctrl/Cmd para selecionar várias.
                            </p>
                        </div>

                        {/* Ingredientes */}
                        <div>
                            <label
                                htmlFor="dish-ingredients"
                                className="mb-1 block text-xs font-semibold text-gray-700"
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
                                className="h-24 w-full rounded-md border border-gray-300 bg-white p-1.5 text-sm text-gray-700 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-200"
                            >
                                {listIngredients.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>

                            <p className="mt-1 text-[11px] text-gray-400">
                                Ctrl/Cmd para selecionar várias.
                            </p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="mt-3 flex items-center justify-between rounded-md bg-gray-50 px-3 py-2.5">
                        <div>
                            <p className="text-xs font-semibold text-gray-700">
                                Prato ativo
                            </p>

                            <p className="text-[11px] text-gray-500">
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

                            <div className="h-5 w-9 rounded-full bg-gray-300 transition peer-checked:bg-gray-700 peer-focus:ring-2 peer-focus:ring-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                    </div>

                    {/* Mensagem */}
                    {messageAlert.message && showContent && (
                        <div
                            className={`mt-3 rounded-md border px-3 py-2 text-xs ${messageAlert.type === "error"
                                ? "border-red-200 bg-red-50 text-red-600"
                                : "border-green-200 bg-green-50 text-green-600"
                                }`}
                        >
                            {messageAlert.message}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-4 flex justify-end border-t border-gray-100 pt-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-gray-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700 
                            disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer "
                        >
                            {loading ? "Salvando..." : "Salvar prato"}
                        </button>
                    </div>
                </form>
            )}

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
                                value={filterName}
                                disabled={loading}
                                onChange={(e) => setFilterName(e.target.value)}

                                placeholder="Buscar por nome..."
                                className="w-full rounded-md border border-gray-300 
                                py-2 pl-3 pr-10 text-sm text-gray-700 outline-none 
                                transition placeholder:text-gray-400 focus:border-gray-500 
                                focus:ring-1 focus:ring-gray-200"
                            />

                            <button
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
                            </button>
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
                                    (option) => Number(option.value)
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
                                <option key={item.id} value={item.id}>
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
                                    (option) => Number(option.value)
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
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Limpar */}
                {(filters.name || filterName ||
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
                                setFilterName("");
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

                {listDish.length > 0 ? (
                    listDish.map((item) => (
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
                                                key={index}
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
