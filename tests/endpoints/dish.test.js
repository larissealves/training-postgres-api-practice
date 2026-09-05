test("Test endpoint - getDish() - No filters", async () => {
    const response = await fetch(
        "http://localhost:3000/api/dishes"
    );

    expect(response.status).toBe(200);

    const data = await response.json();
    console.log(data);
    expect(data).toHaveProperty("data");
    expect(data).toHaveProperty("pagination");

    expect(Array.isArray(data.data)).toBe(true);

    expect(data.pagination).toHaveProperty("totalPages");
    expect(data.pagination).toHaveProperty("currentPage");
    expect(data.pagination).toHaveProperty("limit");
});

test("Test endpoint - getDish() - All Filters", async () => {
    const response = await fetch(
        `http://localhost:3000/api/dishes?
            tags=${1,2}
            &ingredients=${3,4}
            &category=${5}
            &name=${''}
            &currentPage=${1}
            &limit=${5}
        `
    );

    expect(response.status).toBe(200);

    const data = await response.json();
    console.log(data);
    expect(data).toHaveProperty("data");
    expect(data).toHaveProperty("pagination");

    expect(Array.isArray(data.data)).toBe(true);

    expect(data.pagination).toHaveProperty("totalPages");
    expect(data.pagination).toHaveProperty("currentPage");
    expect(data.pagination).toHaveProperty("limit");
});