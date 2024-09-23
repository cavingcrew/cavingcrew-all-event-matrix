function openEventSpaces() {
  const productId = setupCell("Dashboard", "B49");
  const product = getProductById(productId);

  if (product.type === 'variable') {
    openVariableProductSpaces(product);
  } else {
    openSimpleProductSpaces(product);
  }
}

function openVariableProductSpaces(product) {
  const variations = getProductVariations(product.id);
  const ui = SpreadsheetApp.getUi();
  
  let htmlOutput = '<form id="variationForm">';
  variations.forEach(variation => {
    htmlOutput += `
      <label for="${variation.id}">${variation.attributes[0].option}:</label>
      <input type="number" id="${variation.id}" name="${variation.id}" value="${variation.stock_quantity || 0}" min="0"><br><br>
    `;
  });
  htmlOutput += '<input type="submit" value="Update Spaces">';
  htmlOutput += '</form>';

  const htmlTemplate = HtmlService.createTemplate(htmlOutput);
  htmlTemplate.productId = product.id;
  
  const html = htmlTemplate.evaluate().setWidth(300).setHeight(400);
  ui.showModalDialog(html, 'Update Event Spaces');
}

function openSimpleProductSpaces(product) {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    'Update Event Spaces',
    'Enter the number of spaces to open:',
    ui.ButtonSet.OK_CANCEL
  );

  if (result.getSelectedButton() == ui.Button.OK) {
    const newStock = parseInt(result.getResponseText());
    if (!isNaN(newStock) && newStock >= 0) {
      updateProductStock(product.id, newStock);
      ui.alert('Event spaces updated successfully!');
    } else {
      ui.alert('Please enter a valid number of spaces.');
    }
  }
}

function updateProductVariations(productId, updatedVariations) {
  for (const [variationId, newStock] of Object.entries(updatedVariations)) {
    const data = {
      stock_quantity: parseInt(newStock),
      manage_stock: true
    };
    pokeToWordPressProducts(data, productId, variationId);
  }
}

function updateProductStock(productId, newStock) {
  const data = {
    stock_quantity: newStock,
    manage_stock: true
  };
  pokeToWordPressProducts(data, productId);
}
