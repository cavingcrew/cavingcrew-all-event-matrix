function pokeToWordPressOrders(data, order_id) {
	const encodedAuthInformation = Utilities.base64Encode(
		`${apiusername}:${apipassword}`,
	);
	const headers = { Authorization: `Basic ${encodedAuthInformation}` };
	const options = {
		method: "post",
		contentType: "application/json",
		headers: headers, // Convert the JavaScript object to a JSON string.
		payload: JSON.stringify(data),
	};
	const apiUrl = `https://www.${apidomain}/wp-json/wc/v3/orders/${order_id}`;

	const response = UrlFetchApp.fetch(apiUrl, options);
	const responseData = JSON.parse(response.getContentText());
	//console.log(responseData)
	if (response.getResponseCode() === 200) {
		return responseData.id;
	}
	return "Error";
}

function pokeToWordPressProducts(data, product_id, variation_id = null) {
	const encodedAuthInformation = Utilities.base64Encode(
		`${apiusername}:${apipassword}`,
	);
	const headers = { Authorization: `Basic ${encodedAuthInformation}` };
	const options = {
		method: "post",
		contentType: "application/json",
		headers: headers,
		payload: JSON.stringify(data),
	};

	let apiUrl = `https://www.${apidomain}/wp-json/wc/v3/products/${product_id}`;
	if (variation_id) {
		apiUrl += `/variations/${variation_id}`;
	}

	const response = UrlFetchApp.fetch(apiUrl, options);
	const responseData = JSON.parse(response.getContentText());
	if (response.getResponseCode() === 200) {
		return responseData.id;
	}
	return "Error";
}

function getProductById(productId) {
	const encodedAuthInformation = Utilities.base64Encode(
		`${apiusername}:${apipassword}`,
	);
	const headers = { Authorization: `Basic ${encodedAuthInformation}` };
	const apiUrl = `https://www.${apidomain}/wp-json/wc/v3/products/${productId}`;

	const options = {
		method: "get",
		headers: headers,
	};

	const response = UrlFetchApp.fetch(apiUrl, options);
	const productData = JSON.parse(response.getContentText());

	if (response.getResponseCode() === 404) {
		console.log(`[DEBUG] No existing product found with ID: ${productId}`);
	} else {
		console.log(
			`[DEBUG] Retrieved product ${productId}`,
			`SKU: ${productData.sku}`,
			`Status: ${productData.status}`,
		);
	}
	return productData;
}

function getProductBySKU(sku) {
	const encodedAuth = Utilities.base64Encode(`${apiusername}:${apipassword}`);
	const apiUrl = `https://www.${apidomain}/wp-json/wc/v3/products?sku=${encodeURIComponent(sku)}`;
	const response = UrlFetchApp.fetch(apiUrl, {
		headers: { Authorization: `Basic ${encodedAuth}` },
	});
	return JSON.parse(response.getContentText());
}

function getProductVariations(productId) {
	const encodedAuthInformation = Utilities.base64Encode(
		`${apiusername}:${apipassword}`,
	);
	const headers = { Authorization: `Basic ${encodedAuthInformation}` };
	const apiUrl = `https://www.${apidomain}/wp-json/wc/v3/products/${productId}/variations`;

	const options = {
		method: "get",
		headers: headers,
	};

	const response = UrlFetchApp.fetch(apiUrl, options);
	return JSON.parse(response.getContentText());
}

function pokeToWooUserMeta(data, user_id) {
	const encodedAuthInformation = Utilities.base64Encode(
		`${apiusername}:${apipassword}`,
	);
	const headers = { Authorization: `Basic ${encodedAuthInformation}` };
	const options = {
		method: "post",
		contentType: "application/json",
		headers: headers, // Convert the JavaScript object to a JSON string.
		payload: JSON.stringify(data),
	};
	const apiUrl = `https://www.${apidomain}/wp-json/wc/v3/customers/${user_id}`;

	const response = UrlFetchApp.fetch(apiUrl, options);
	const responseData = JSON.parse(response.getContentText());
	if (response.getResponseCode() === 200) {
		return responseData;
	}
	return "Error";
}

function pokeNoteToOrder(orderNumber, noteText) {
	const apiUrl = `https://www.${apidomain}/wp-json/wc/v3/orders/${orderNumber}/notes`;
	const encodedAuthInformation = Utilities.base64Encode(
		`${apiusername}:${apipassword}`,
	);
	const headers = {
		Authorization: `Basic ${encodedAuthInformation}`,
		"Content-Type": "application/json",
	};
	const payload = { note: noteText };
	const options = {
		method: "post",
		headers: headers,
		payload: JSON.stringify(payload),
	};
	const response = UrlFetchApp.fetch(apiUrl, options);
	const responseData = JSON.parse(response.getContentText());
	//console.log(response.getResponseCode())
	if (response.getResponseCode() === 201) {
		//console.log(responseData)
		return responseData.id;
	}
}

function sendProductToWordPress(product) {
	console.log(
		`[PRODUCT CREATE] Attempting to create product from template:`,
		JSON.stringify({
			name: product.name,
			type: product.type,
			sku: product.sku,
			variation_count: product.variations?.length || 0,
		}),
	);

	// Add SKU validation for variations
	const variationSkus = new Set();
	if (product.variations && product.variations.length > 0) {
		product.variations.forEach((v) => {
			if (!v.sku || v.sku === "2024-XX-ZZ") {
				// Explicitly block template SKUs
				v.sku = `${product.sku}-${Math.random().toString(36).substring(2, 6)}`;
			}

			if (variationSkus.has(v.sku)) {
				throw new Error(`Duplicate variation SKU detected: ${v.sku}`);
			}
			variationSkus.add(v.sku);
		});
	}

	const encodedAuthInformation = Utilities.base64Encode(
		`${apiusername}:${apipassword}`,
	);
	const headers = { Authorization: `Basic ${encodedAuthInformation}` };

	// First create the base product
	const productUrl = `https://www.${apidomain}/wp-json/wc/v3/products`;
	const options = {
		method: "post",
		contentType: "application/json",
		headers: headers,
		payload: JSON.stringify({
			...product,
			variations: [], // Create product first without variations
		}),
	};

	const response = UrlFetchApp.fetch(productUrl, options);
	const newProduct = JSON.parse(response.getContentText());
	console.log(
		`[PRODUCT CREATED] ID: ${newProduct.id}`,
		`SKU: ${newProduct.sku}`,
		`Status: ${newProduct.status}`,
	);

	// Now create variations for the new product
	if (product.variations && product.variations.length > 0) {
		console.log(
			`[VARIATION CREATE] Creating ${product.variations.length} variations for product ${newProduct.id}`,
		);
		const variationsUrl = `https://www.${apidomain}/wp-json/wc/v3/products/${newProduct.id}/variations`;

		product.variations.forEach((v, i) => {
			console.log(
				`[VARIATION ${i}]`,
				`Attributes: ${JSON.stringify(v.attributes)}`,
				`SKU: ${v.sku}`,
				`Stock: ${v.stock_quantity}`,
			);
		});

		for (const variation of product.variations) {
			const variationPayload = {
				...variation,
				manage_stock: Boolean(variation.manage_stock),
				stock_quantity: Number(variation.stock_quantity) || 0,
				sku: variation.sku ? `${newProduct.sku}-${variation.sku}` : "",
				meta_data: variation.meta_data
					.map((meta) => ({
						...meta,
						value:
							meta.key === "manage_stock" ? Boolean(meta.value) : meta.value,
					}))
					.filter(
						(meta) => !["_associated_post", "_original_id"].includes(meta.key),
					),
			};

			const variationOptions = {
				method: "post",
				contentType: "application/json",
				headers: headers,
				payload: JSON.stringify(variationPayload),
			};

			UrlFetchApp.fetch(variationsUrl, variationOptions);
		}
	}

	return newProduct.id;
}
