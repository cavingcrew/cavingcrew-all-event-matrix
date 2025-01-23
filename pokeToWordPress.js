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

function createDuplicateProduct(originalProduct) {
	// Deep clone the product including all metadata
	const newProduct = JSON.parse(JSON.stringify(originalProduct));

	// Reset WordPress-specific identifiers
	newProduct.id = "";
	newProduct.sku = "";
	newProduct.status = "draft";
	newProduct.date_created = null;
	newProduct.date_modified = null;

	// Preserve membership-related meta data
	const preservedMetaKeys = new Set([
		"_membership_discount",
		"_membership_scheme",
		"_subscription_price",
		"_subscription_sign_up_fee",
	]);

	newProduct.meta_data = newProduct.meta_data
		.filter(
			(meta) =>
				!["_edit_lock", "_edit_last"].includes(meta.key) ||
				preservedMetaKeys.has(meta.key),
		)
		.map((meta) => ({
			key: meta.key,
			value: meta.value,
			id: undefined, // Clear existing meta IDs
		}));

	// Copy variations with all their properties
	newProduct.variations = [];
	if (originalProduct.variations && originalProduct.variations.length > 0) {
		const originalVariations = getProductVariations(originalProduct.id);
		newProduct.variations = originalVariations.map((v) => ({
			...v,
			id: undefined, // Clear variation ID for new creation
			date_created: null,
			date_modified: null,
			meta_data: v.meta_data.map((meta) => ({
				key: meta.key,
				value: meta.value,
				id: undefined,
			})),
		}));
	}

	return newProduct;
}

function slugify(text) {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim();
}

function sendProductToWordPress(product) {
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

	// Now create variations for the new product
	if (product.variations && product.variations.length > 0) {
		const variationsUrl = `https://www.${apidomain}/wp-json/wc/v3/products/${newProduct.id}/variations`;

		product.variations.forEach((variation) => {
			const variationPayload = {
				...variation,
				sku: variation.sku ? `${newProduct.sku}-${variation.sku}` : "",
				meta_data: variation.meta_data.filter(
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
		});
	}

	return newProduct.id;
}
