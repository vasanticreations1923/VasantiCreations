/* =========================================================
   VASANTI CREATIONS - MAIN SCRIPT
   Google Apps Script enquiry email integration
   ========================================================= */

const EMAIL_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzeeMeDyq5-zuzzx6OqoqGkZB7FB31z_gDFp2U6m3yUl18VlTkDqameFTXmPJ6o-94Y6g/exec";


/* =========================================================
   MOBILE MENU
   ========================================================= */

function toggleMenu() {
    const nav = document.getElementById("navLinks");

    if (nav) {
        nav.classList.toggle("active");
    }
}


/* =========================================================
   LANGUAGE SWITCH
   ========================================================= */

function setLanguage(lang) {

    localStorage.setItem("vasantiLanguage", lang);

    document.querySelectorAll("[data-en]").forEach(function (element) {

        const text = element.getAttribute("data-" + lang);

        if (text) {
            element.textContent = text;
        }

    });

    document.querySelectorAll(".lang-switch button").forEach(function (button) {

        button.classList.remove("active");

        if (button.getAttribute("data-lang") === lang) {
            button.classList.add("active");
        }

    });
}


/* =========================================================
   LOAD SAVED LANGUAGE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const savedLanguage =
        localStorage.getItem("vasantiLanguage") || "en";

    setLanguage(savedLanguage);

});


/* =========================================================
   CUSTOM GIFT BUILDER
   ========================================================= */

let selectedBudget = 0;

let selectedProducts = [];


/* =========================================================
   SELECT BUDGET
   ========================================================= */

function selectBudget(budget, element) {

    selectedBudget = Number(budget);

    selectedProducts = [];

    document.querySelectorAll(".budget-card").forEach(function (card) {
        card.classList.remove("active");
    });

    if (element) {
        element.classList.add("active");
    }

    const displayBudget =
        document.getElementById("displayBudget");

    if (displayBudget) {
        displayBudget.textContent = selectedBudget;
    }

    const productSection =
        document.getElementById("productSection");

    if (productSection) {
        productSection.style.display = "block";
    }

    /*
     * Show all products whose price is LESS THAN
     * OR EQUAL TO selected budget.
     *
     * Example:
     * ₹99  → products up to ₹99
     * ₹199 → products up to ₹199
     * ₹299 → products up to ₹299
     * ₹499 → products up to ₹499
     */

    document.querySelectorAll(".gift-product").forEach(function (product) {

        const price =
            Number(product.dataset.price || 0);

        product.classList.remove("selected");

        if (price <= selectedBudget) {

            product.style.display = "";

        } else {

            product.style.display = "none";

        }

    });

    updateGiftSummary();

    /*
     * Automatically scroll user to products.
     */

    setTimeout(function () {

        if (productSection) {

            productSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }, 100);

}


/* =========================================================
   SELECT / DESELECT PRODUCT
   ========================================================= */

function toggleProduct(element) {

    if (!element) return;

    if (!selectedBudget) {

        alert("Please select your budget first.");

        return;
    }

    const productName =
        element.dataset.name || "Product";

    const productPrice =
        Number(element.dataset.price || 0);

    /*
     * If already selected → remove
     */

    const existingIndex =
        selectedProducts.findIndex(function (item) {

            return item.name === productName;

        });


    if (existingIndex !== -1) {

        selectedProducts.splice(existingIndex, 1);

        element.classList.remove("selected");

    }

    /*
     * Otherwise add product
     */

    else {

        selectedProducts.push({

            name: productName,

            price: productPrice,

            quantity: 1

        });

        element.classList.add("selected");

    }

    updateGiftSummary();

}


/* =========================================================
   UPDATE PRODUCT QUANTITY
   ========================================================= */

function updateProductQuantity(productName, quantity) {

    quantity = Number(quantity);

    if (quantity < 1) {
        quantity = 1;
    }

    const product =
        selectedProducts.find(function (item) {

            return item.name === productName;

        });

    if (product) {

        product.quantity = quantity;

    }

    updateGiftSummary();

}


/* =========================================================
   GET SELECTED TOTAL
   ========================================================= */

function getSelectedTotal() {

    let total = 0;

    selectedProducts.forEach(function (product) {

        total +=
            product.price *
            product.quantity;

    });

    return total;

}


/* =========================================================
   UPDATE GIFT SUMMARY
   ========================================================= */

function updateGiftSummary() {

    const budgetSummary =
        document.getElementById("budgetSummary");

    const productSummary =
        document.getElementById("productSummary");

    const totalSummary =
        document.getElementById("totalSummary");

    const remainingSummary =
        document.getElementById("remainingSummary");

    const grandTotal =
        document.getElementById("grandTotal");

    const displayBudget =
        document.getElementById("displayBudget");


    /*
     * Quantity from order form
     */

    const quantityInput =
        document.getElementById("quantity");

    let orderQuantity =
        quantityInput
            ? Number(quantityInput.value || 1)
            : 1;

    if (orderQuantity < 1) {
        orderQuantity = 1;
    }


    /*
     * Selected product total
     */

    const selectedTotal =
        getSelectedTotal();


    /*
     * Budget information
     */

    if (budgetSummary) {

        budgetSummary.textContent =
            "Budget per Gift: ₹" +
            selectedBudget;

    }


    if (displayBudget) {

        displayBudget.textContent =
            selectedBudget;

    }


    /*
     * Product summary
     */

    if (productSummary) {

        if (selectedProducts.length === 0) {

            productSummary.textContent =
                "No products selected";

        }

        else {

            let productText = "Selected Products: ";

            productText +=
                selectedProducts.map(function (product) {

                    return (
                        product.name +
                        " × " +
                        product.quantity +
                        " (₹" +
                        product.price +
                        ")"
                    );

                }).join(", ");

            productSummary.textContent =
                productText;

        }

    }


    /*
     * Selected total
     */

    if (totalSummary) {

        totalSummary.textContent =
            "Selected Total: ₹" +
            selectedTotal;

    }


    /*
     * Remaining budget
     */

    const remaining =
        selectedBudget - selectedTotal;


    if (remainingSummary) {

        if (!selectedBudget) {

            remainingSummary.textContent =
                "Remaining Budget: ₹0";

            remainingSummary.className =
                "remaining good";

        }

        else if (remaining >= 0) {

            remainingSummary.textContent =
                "Remaining Budget: ₹" +
                remaining;

            remainingSummary.className =
                "remaining good";

        }

        else {

            remainingSummary.textContent =
                "Over Selected Budget: ₹" +
                Math.abs(remaining);

            remainingSummary.className =
                "remaining over";

        }

    }


    /*
     * Total order value
     *
     * Example:
     * Gift = ₹99
     * Quantity = 10
     * Order value = ₹990
     */

    const estimatedOrderValue =
        selectedTotal * orderQuantity;


    if (grandTotal) {

        grandTotal.innerHTML =
            "<strong>Estimated Order Value: ₹" +
            estimatedOrderValue +
            "</strong>";

    }


    /*
     * Update quantity fields if they exist.
     */

    renderSelectedProducts();

}


/* =========================================================
   RENDER SELECTED PRODUCTS WITH QUANTITY
   ========================================================= */

function renderSelectedProducts() {

    const container =
        document.getElementById("selectedProductsList");

    if (!container) return;

    if (selectedProducts.length === 0) {
        container.innerHTML =
            "<p class='no-products'>No products selected yet.</p>";
        return;
    }

    let html = "";

    selectedProducts.forEach(function (product, index) {

        const productTotal =
            product.price * product.quantity;

        html += `
            <div class="selected-product-row">

                <div class="selected-product-info">

                    <strong>${escapeHtml(product.name)}</strong>

                    <span>
                        ₹${product.price} each
                    </span>

                </div>

                <div class="quantity-control">

                    <button
                        type="button"
                        class="qty-btn"
                        onclick="changeSelectedProductQuantity(${index}, -1)">
                        −
                    </button>

                    <span class="qty-number">
                        ${product.quantity}
                    </span>

                    <button
                        type="button"
                        class="qty-btn"
                        onclick="changeSelectedProductQuantity(${index}, 1)">
                        +
                    </button>

                </div>

                <div class="selected-product-total">
                    ₹${productTotal}
                </div>

                <button
                    type="button"
                    class="remove-product"
                    onclick="removeSelectedProduct(${index})">
                    Remove
                </button>

            </div>
        `;
    });

    container.innerHTML = html;
}


function changeSelectedProductQuantity(index, change) {

    if (!selectedProducts[index]) return;

    let newQuantity =
        selectedProducts[index].quantity + Number(change);

    /*
     * Minimum quantity is 1.
     */
    if (newQuantity < 1) {
        newQuantity = 1;
    }

    selectedProducts[index].quantity =
        newQuantity;

    updateGiftSummary();
}


/* =========================================================
   REMOVE SELECTED PRODUCT
   ========================================================= */

function removeSelectedProduct(index) {

    if (!selectedProducts[index]) return;


    const productName =
        selectedProducts[index].name;


    selectedProducts.splice(index, 1);


    /*
     * Remove selected visual state
     */

    document.querySelectorAll(".gift-product").forEach(function (element) {

        if (element.dataset.name === productName) {

            element.classList.remove("selected");

        }

    });


    updateGiftSummary();

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================================
   GET FORM DATA
   ========================================================= */

function getEnquiryData() {

    const customerName =
        document.getElementById("customerName")?.value.trim() || "";

    const customerPhone =
        document.getElementById("customerPhone")?.value.trim() || "";

    const occasion =
        document.getElementById("occasion")?.value || "";

    const quantity =
        Number(
            document.getElementById("quantity")?.value || 1
        );

    const deliveryDate =
        document.getElementById("deliveryDate")?.value || "";

    const specialMessage =
        document.getElementById("specialMessage")?.value.trim() || "";


    return {

        customerName,

        customerPhone,

        occasion,

        quantity,

        deliveryDate,

        specialMessage,

        budget: selectedBudget,

        products: selectedProducts.map(function (product) {

            return {

                name: product.name,

                price: product.price,

                quantity: product.quantity,

                total:
                    product.price *
                    product.quantity

            };

        }),

        selectedTotal:
            getSelectedTotal(),

        estimatedOrderValue:
            getSelectedTotal() * quantity

    };

}


/* =========================================================
   VALIDATE ENQUIRY
   ========================================================= */

function validateEnquiry(data) {

    if (!data.customerName) {

        alert("Please enter your name.");

        return false;

    }


    if (!data.customerPhone) {

        alert("Please enter your WhatsApp number.");

        return false;

    }


    if (!data.occasion) {

        alert("Please select an occasion.");

        return false;

    }


    if (!data.budget) {

        alert("Please select a budget first.");

        return false;

    }


    if (data.products.length === 0) {

        alert("Please select at least one product.");

        return false;

    }


    return true;

}


/* =========================================================
   CREATE PRODUCT TEXT
   ========================================================= */

function createProductText(products) {

    if (!products || products.length === 0) {

        return "No products selected";

    }


    return products.map(function (product) {

        return (
            product.name +
            " × " +
            product.quantity +
            " @ ₹" +
            product.price +
            " = ₹" +
            product.total
        );

    }).join("\n");

}


/* =========================================================
   SEND ENQUIRY TO GOOGLE APPS SCRIPT
   ========================================================= */

async function sendEnquiryToGoogleScript(data) {

    const payload = {

        customerName:
            data.customerName,

        customerPhone:
            data.customerPhone,

        occasion:
            data.occasion,

        quantity:
            data.quantity,

        deliveryDate:
            data.deliveryDate,

        specialMessage:
            data.specialMessage,

        budget:
            data.budget,

        products:
            createProductText(data.products),

        selectedTotal:
            data.selectedTotal,

        estimatedOrderValue:
            data.estimatedOrderValue

    };


    const response =
        await fetch(
            EMAIL_SCRIPT_URL,
            {

                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(payload)

            }
        );


    /*
     * Because Google Apps Script Web Apps
     * with no-cors do not expose the response,
     * reaching this point means the request
     * was submitted to the endpoint.
     */

    return true;

}


/* =========================================================
   SEND WHATSAPP ENQUIRY
   ========================================================= */

async function sendWhatsAppEnquiry() {

    const data =
        getEnquiryData();


    if (!validateEnquiry(data)) {
        return;
    }


    const productText =
        createProductText(data.products);


    let message = "";

    message +=
        "*VASANTI CREATIONS - GIFT ENQUIRY*\n\n";

    message +=
        "*Customer:* " +
        data.customerName +
        "\n";

    message +=
        "*WhatsApp:* " +
        data.customerPhone +
        "\n";

    message +=
        "*Occasion:* " +
        data.occasion +
        "\n";

    message +=
        "*Budget per Gift:* ₹" +
        data.budget +
        "\n";

    message +=
        "*Quantity:* " +
        data.quantity +
        "\n";


    if (data.deliveryDate) {

        message +=
            "*Delivery Date:* " +
            data.deliveryDate +
            "\n";

    }


    message +=
        "\n*Selected Products:*\n" +
        productText +
        "\n";


    message +=
        "\n*Selected Total:* ₹" +
        data.selectedTotal;


    message +=
        "\n*Estimated Order Value:* ₹" +
        data.estimatedOrderValue;


    if (data.specialMessage) {

        message +=
            "\n\n*Special Requirement:*\n" +
            data.specialMessage;

    }


    /*
     * Send email enquiry as well.
     */

    try {

        await sendEnquiryToGoogleScript(data);

    }

    catch (error) {

        console.error(
            "Google Script Error:",
            error
        );

    }


    /*
     * Your WhatsApp number
     */

    const whatsappNumber =
        "919890021266";


    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);


    window.open(
        whatsappURL,
        "_blank"
    );

}


/* =========================================================
   SEND EMAIL ENQUIRY
   ========================================================= */

async function sendEmailEnquiry() {

    const data =
        getEnquiryData();


    if (!validateEnquiry(data)) {
        return;
    }


    const button =
        event?.target;


    if (button) {

        button.disabled = true;

        button.textContent =
            "Sending...";

    }


    try {

        await sendEnquiryToGoogleScript(data);


        alert(
            "Thank you! Your enquiry has been sent successfully. We will contact you shortly."
        );


    }

    catch (error) {

        console.error(
            "Email enquiry error:",
            error
        );


        alert(
            "Unable to send the enquiry right now. Please contact us on WhatsApp."
        );

    }


    finally {

        if (button) {

            button.disabled = false;

            button.textContent =
                "📧 Send Enquiry by Email";

        }

    }

}


/* =========================================================
   CLOSE MOBILE MENU WHEN LINK CLICKED
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.matches(
                ".nav-links a"
            )
        ) {

            const nav =
                document.getElementById(
                    "navLinks"
                );

            if (nav) {

                nav.classList.remove(
                    "active"
                );

            }

        }

    }
);


/* =========================================================
   UPDATE ORDER VALUE WHEN QUANTITY CHANGES
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const quantity =
            document.getElementById(
                "quantity"
            );


        if (quantity) {

            quantity.addEventListener(
                "input",
                updateGiftSummary
            );

        }


        updateGiftSummary();

    }
);