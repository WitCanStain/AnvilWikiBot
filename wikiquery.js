

async function wikiQuery(query_text) {
    try {
        let { title, category } = await wikiGetItemTitleAndCategory(query_text);
        console.log(`title: ${title}`)
        console.log(`category: ${category}`)
        let cargofields = await cargoFieldQuery(category)
        let cargo_data = await cargoQuery(title, category, cargofields);
        let icon_file_name=cargo_data["Icon"]
        delete cargo_data["Icon"]
        Object.entries(cargo_data).map(([key, value]) => {
            if (key.startsWith('Requires')) {
                if (value=='0') cargo_data[key] = 'No'
                if (value=='1') cargo_data[key] = 'Yes'
            }
        })
        console.info(`cargo data: ${JSON.stringify(cargo_data)}`);
        let image_url = await getImageUrlFromFileName(icon_file_name);
        return {title:title, image_url:image_url, data:cargo_data}
    } catch (err) {
        console.error(err.message);
    }
}

async function wikiGetItemTitleAndCategory(query_text) {
    let query_params = {
        action: 'query',
        format: 'json',
        prop: 'categories',
        generator: 'search',
        formatversion: '2',
        clshow: '!hidden',
        clcategories: 'category:foods|category:animals|category:armours|category:structures|category:vehicles|category:tools|category:resources|category:weapons',
        gsrsearch: `intitle:${query_text}`,
        gsrlimit: '1',
        gsrqiprofile: 'engine_autoselect',
        gsrinfo: 'rewrittenquery',
        gsrenablerewrites: '1'
    };//action=query&format=json&prop=categories&generator=search&formatversion=2&clprop=&clshow=!hidden&clcategories=Category%3Afoods%7Ccategory%3Aweapons%7Ccategory%3Aanimals%7Ccategory%3Aresources%7Ccategory%3Aarmours%7Ccategory%3Atools%7Ccategory%3Avehicles%7Ccategory%3Astructures&gsrsearch=intitle%3A${query_text}&gsrlimit=1&gsrqiprofile=engine_autoselect&gsrinfo=rewrittenquery&gsrprop=sectiontitle%7Ctitlesnippet&gsrenablerewrites=1
    const searchParams = new URLSearchParams(query_params);
    // console.log(`search params: ${searchParams.toString()}`)
    const res = await fetch(`https://anvilempires.wiki.gg/api.php?${searchParams.toString()}`);
    const data = (await res.json())?.query?.pages?.[0];
    const title = data?.title;
    let category = data?.categories?.[0]?.title ? data.categories[0].title.split(':')[1].toLowerCase() : null;
    if (category === 'structures') category = 'structuretiers'
    return { title: title, category: category }
}

async function cargoFieldQuery(category) {
    let field_query_params = {
        action: 'cargofields',
        format: 'json',
        table: category,
        formatversion: '2'
    } //https://anvilempires.wiki.gg/api.php?action=cargofields&format=json&table=structuretiers&formatversion=2
    const searchParams = new URLSearchParams(field_query_params);
    const res = await fetch(`https://anvilempires.wiki.gg/api.php?${searchParams.toString()}`);
    const data = (await res.json())?.cargofields;
    let disallowed_fields = ['IsReleasedAndEnabled', 'ContentLang', 'CodeNameString'];
    let cargo_fields = Object.keys(data).filter(field_name => !disallowed_fields.includes(field_name));
    console.log(`cargo fields: ${JSON.stringify(cargo_fields)}`);
    return cargo_fields;
}

async function cargoQuery(title, category, fields) {
    try {
        let field_query_params = {
            action: 'cargoquery',
            format: 'json',
            tables: category,
            fields: fields.join(','),
            where: `NameText='${title}'`,
            formatversion: '2'
        } //https://anvilempires.wiki.gg/api.php?action=cargoquery&format=json&tables=structuretiers&fields=Tier%2CMaxHealth%2CRequiredTool&where=NameText%3D'Anvil'&formatversion=2
        const searchParams = new URLSearchParams(field_query_params);
        // console.log(`query string: ${searchParams.toString()}`)
        const res = await fetch(`https://anvilempires.wiki.gg/api.php?${searchParams.toString()}`);
        const data = (await res.json())?.cargoquery?.[0]?.title;
        // console.log(JSON.stringify(data));
        return data
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function getImageUrlFromFileName(file_name) {
    try { //https://anvilempires.wiki.gg/api.php?action=query&format=json&prop=imageinfo&titles=File%3AIconHelmetHeavy.png&formatversion=2&iiprop=url
        let field_query_params = {
            action: 'query',
            format: 'json',
            prop: 'imageinfo',
            titles: `File:${file_name}`,
            iiprop: 'url',
            formatversion: '2'
        }
        const searchParams = new URLSearchParams(field_query_params);
        const res = await fetch(`https://anvilempires.wiki.gg/api.php?${searchParams.toString()}`);
        const data = (await res.json())?.query?.pages?.[0]?.imageinfo?.[0]?.url
        // console.log(JSON.stringify(data));
        return data
    } catch (e) {
        console.error(e);
        return null;
    }
}

module.exports = { wikiQuery }

