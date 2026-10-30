const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Ouvrir le menu" : "Fermer le menu");
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
      siteNav.classList.remove("is-open");
    });
  });
}

const year = document.querySelector("#year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

const advisorForm = document.querySelector("#advisor-form");

if (advisorForm) {
  const advisorPanel = document.querySelector(".advisor-panel");
  const advisorToggle = document.querySelector("#advisor-toggle");
  const advisorContent = document.querySelector("#advisor-content");

  if (advisorPanel && advisorToggle && advisorContent) {
    advisorPanel.classList.add("is-floating");
    advisorPanel.parentElement?.classList.add("is-widget-layout");
    advisorToggle.addEventListener("click", () => {
      const isExpanded = advisorToggle.getAttribute("aria-expanded") === "true";
      advisorToggle.setAttribute("aria-expanded", String(!isExpanded));
      advisorContent.hidden = isExpanded;
      advisorPanel.classList.toggle("is-open", !isExpanded);
    });
  }

  const roomAdvice = {
    salon: {
      label: "votre salon",
      focus: "Choisissez d’abord les assises principales, puis complétez avec une table basse et des meubles de rangement adaptés à votre pièce.",
      tips: ["Commencez par le canapé, puis vérifiez les passages avant d’ajouter fauteuils et table basse.", "Prévoyez environ 70 cm pour circuler confortablement autour des meubles."],
    },
    "salle-a-manger": {
      label: "votre salle à manger",
      focus: "Choisissez votre table selon l’espace disponible et le nombre de personnes que vous recevez habituellement.",
      tips: ["Gardez idéalement environ 90 cm autour de la table pour le recul des chaises et le passage.", "Choisissez une table proportionnée au nombre de personnes qui l’utilisent au quotidien."],
    },
    chambre: {
      label: "votre chambre",
      focus: "Commencez par choisir le lit et les rangements adaptés aux dimensions de votre chambre.",
      tips: ["Vérifiez les dimensions du lit et les zones de circulation avant de choisir les rangements.", "Prévoyez les rangements en fonction de vos besoins réels pour garder une pièce reposante."],
    },
    entree: {
      label: "votre entrée ou autre espace",
      focus: "Définissez les meubles dont vous avez besoin, puis choisissez des dimensions adaptées à votre entrée ou votre espace.",
      tips: ["Tenez compte des portes, fenêtres, prises et zones de passage.", "Privilégiez des meubles peu profonds pour préserver une circulation fluide."],
    },
  };
  const styleAdvice = {
    naturel: "Pour un style naturel et apaisant, explorez les tons sable, les verts doux, le bois et les textures naturelles.",
    contemporain: "Pour un style contemporain et épuré, partez d’une palette sobre, de lignes simples et de quelques contrastes bien choisis.",
    chaleureux: "Pour une ambiance chaleureuse et conviviale, associez des tons chauds, des textiles doux et des matières qui donnent envie de s’installer.",
    elegant: "Pour une élégance intemporelle, privilégiez une palette équilibrée, des finitions soignées et quelques détails qui attirent le regard.",
    indecis: "Pour trouver votre style, rassemblez quelques images qui vous plaisent et repérez les couleurs, matières et formes qui reviennent.",
  };
  const budgetAdvice = {
    economique: "Priorisez le meuble qui répond le mieux à votre besoin principal. Le prix dépendra du modèle et des dimensions disponibles.",
    modere: "Répartissez votre budget entre le meuble principal et les éléments de mobilier complémentaires dont vous avez besoin.",
    confort: "Cette enveloppe permet d’envisager plusieurs meubles pour équiper la pièce ; confirmez les modèles et leurs prix auprès d’Inova.",
    flexible: "L’équipe Inova pourra vous présenter des options de mobilier en fonction de vos préférences et des modèles disponibles.",
    "a-definir": "Vous pouvez choisir vos meubles et demander leurs prix à l’équipe Inova avant de fixer votre budget.",
  };
  const priorityAdvice = {
    optimiser: "Comparez les dimensions de vos meubles souhaités avec celles de la pièce et des passages.",
    meubler: "Listez les meubles indispensables et choisissez d’abord ceux qui répondent à vos besoins quotidiens.",
    ambiance: "Réunissez des exemples de couleurs et de matières qui vous plaisent pour choisir des meubles harmonieux.",
    complet: "Avancez dans cet ordre : besoins, mesures, meubles principaux, rangements, puis compléments.",
  };
  const usageAdvice = {
    quotidien: "Pour un usage quotidien, privilégiez des matériaux faciles à entretenir et des assises confortables.",
    reception: "Pour recevoir, pensez aux assises supplémentaires et à des meubles modulables ou faciles à déplacer.",
    occasionnel: "Pour un usage occasionnel, concentrez le budget sur les pièces essentielles et les finitions qui vous plaisent.",
  };
  const furnitureAdvice = {
    conserver: "Conservez les meubles qui vous conviennent et choisissez les nouveaux éléments autour de leurs dimensions et couleurs.",
    remplacer: "Remplacez d’abord les meubles qui ne répondent plus à vos besoins, puis harmonisez les pièces complémentaires.",
    repartir: "En partant de zéro, définissez d’abord les fonctions indispensables et l’ordre d’achat des meubles.",
  };
  const answerLabels = {
    style: {
      naturel: "Naturel et apaisant",
      contemporain: "Contemporain et épuré",
      chaleureux: "Chaleureux et convivial",
      elegant: "Élégant et intemporel",
      indecis: "Style à définir",
    },
    budget: {
      economique: "Budget maîtrisé",
      modere: "Budget intermédiaire",
      confort: "Budget confort",
      flexible: "Budget flexible",
      "a-definir": "Budget à définir",
    },
    priority: {
      optimiser: "Trouver le mobilier adapté à mes dimensions",
      meubler: "Choisir les meubles essentiels",
      ambiance: "Coordonner meubles, couleurs et matières",
      complet: "Équiper toute la pièce",
    },
    usage: {
      quotidien: "Usage quotidien",
      reception: "Recevoir famille et amis",
      occasionnel: "Usage occasionnel",
    },
    furniture: {
      conserver: "Garder certains meubles",
      remplacer: "Remplacer plusieurs meubles",
      repartir: "Aménager la pièce de zéro",
    },
  };
  const result = document.querySelector("#advisor-result");
  const resultTitle = document.querySelector("#advisor-result-title");
  const resultSummary = document.querySelector("#advisor-result-summary");
  const resultTips = document.querySelector("#advisor-result-tips");
  const resultContact = document.querySelector("#advisor-result-contact");
  const restartButton = document.querySelector("#advisor-restart");
  const advisorError = document.querySelector("#advisor-error");

  function createAdvisorAdvice(answers) {
    const advice = roomAdvice[answers.room];
    if (
      !advice ||
      !styleAdvice[answers.style] ||
      !budgetAdvice[answers.budget] ||
      !priorityAdvice[answers.priority] ||
      !usageAdvice[answers.usage] ||
      !furnitureAdvice[answers.furniture] ||
      !answerLabels.style[answers.style] ||
      !answerLabels.budget[answers.budget] ||
      !answerLabels.priority[answers.priority] ||
      !answerLabels.usage[answers.usage] ||
      !answerLabels.furniture[answers.furniture]
    ) {
      return null;
    }

    const hasWidth = answers.width !== "";
    const hasLength = answers.length !== "";
    if (hasWidth !== hasLength) {
      return null;
    }

    const tips = [
      ...advice.tips,
      priorityAdvice[answers.priority],
      usageAdvice[answers.usage],
      furnitureAdvice[answers.furniture],
    ];
    let dimensions = "Sans dimensions renseignées, prenez les mesures de la pièce, des portes et des passages avant de choisir.";
    const formatMeasure = (measure) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(measure);
    if (hasWidth && hasLength) {
      const width = Number(answers.width);
      const length = Number(answers.length);
      if (!Number.isFinite(width) || !Number.isFinite(length) || width <= 0 || length <= 0 || width > 30 || length > 30) {
        return null;
      }

      const area = width * length;
      const formattedArea = formatMeasure(area);
      const formattedWidth = formatMeasure(width);
      const formattedLength = formatMeasure(length);
      const roomSize = area < 12
        ? "La pièce semble compacte : favorisez des meubles peu profonds et multifonctions."
        : area <= 24
          ? "La surface permet de composer un ensemble équilibré ; gardez des passages dégagés."
          : "La surface offre de la flexibilité : structurez l’espace en zones sans multiplier les meubles.";
      dimensions = `Pour ${formattedArea} m² estimés (${formattedWidth} m × ${formattedLength} m), ${roomSize.toLowerCase()}`;
      tips.unshift(`Surface indicative : ${formattedArea} m². Vérifiez aussi les ouvertures et les passages.`);
    }

    return {
      title: `Votre projet mobilier pour ${advice.label}`,
      summary: `${dimensions} ${advice.focus} ${styleAdvice[answers.style]} Budget : ${answerLabels.budget[answers.budget]}. ${budgetAdvice[answers.budget]}`,
      tips,
      message: [
        "Bonjour Inova, je souhaite être conseillé(e) pour un projet de mobilier d’intérieur.",
        `Pièce : ${advice.label}.`,
        ...(hasWidth && hasLength ? [`Dimensions approximatives : ${formatMeasure(Number(answers.width))} m × ${formatMeasure(Number(answers.length))} m.`] : []),
        `Style souhaité : ${answerLabels.style[answers.style]}.`,
        `Budget envisagé : ${answerLabels.budget[answers.budget]}.`,
        `Usage : ${answerLabels.usage[answers.usage]}.`,
        `Mobilier existant : ${answerLabels.furniture[answers.furniture]}.`,
        `Ma priorité : ${answerLabels.priority[answers.priority]}.`,
      ].join(" "),
    };
  }

  advisorForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!advisorForm.reportValidity()) {
      return;
    }

    const formData = new FormData(advisorForm);
    const answers = {
      room: String(formData.get("room")),
      style: String(formData.get("style")),
      budget: String(formData.get("budget")),
      priority: String(formData.get("priority")),
      usage: String(formData.get("usage")),
      furniture: String(formData.get("furniture")),
      width: String(formData.get("width")).trim(),
      length: String(formData.get("length")).trim(),
    };
    const guidance = createAdvisorAdvice(answers);

    if (!guidance) {
      if (advisorError) {
        advisorError.hidden = false;
      }
      return;
    }
    if (advisorError) {
      advisorError.hidden = true;
    }

    if (resultTitle) {
      resultTitle.textContent = guidance.title;
    }
    if (resultSummary) {
      resultSummary.textContent = guidance.summary;
    }
    if (resultTips) {
      resultTips.replaceChildren();
      guidance.tips.forEach((tip) => {
        const item = document.createElement("li");
        item.textContent = tip;
        resultTips.append(item);
      });
    }
    if (resultContact) {
      resultContact.href = `https://wa.me/33665201297?text=${encodeURIComponent(guidance.message)}`;
      resultContact.target = "_blank";
      resultContact.rel = "noreferrer";
    }

    advisorForm.hidden = true;
    if (result) {
      result.hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });

  restartButton?.addEventListener("click", () => {
    advisorForm.hidden = false;
    result.hidden = true;
    if (advisorError) {
      advisorError.hidden = true;
    }
    advisorForm.reset();
    advisorForm.querySelector("select")?.focus();
  });
}

const categories = {
  salon: {
    title: "Le salon",
    description: "Explorez des inspirations de mobilier pour le salon : assises, tables basses et rangements. Les modèles, photos et disponibilités sont à confirmer auprès d’Inova.",
    inspirations: [
        ["Salon convivial", [
          "images/products/salon-convivial-01.webp",
          "images/products/salon-convivial-02.webp",
          "images/products/salon-convivial-03.webp",
          "images/products/salon-convivial-04.webp",
          "images/products/salon-convivial-05.webp",
          "images/products/salon-convivial-06.webp",
          "images/products/salon-convivial-07.webp",
          "images/products/salon-convivial-08.webp",
          "images/products/salon-convivial-09.webp",
        ]],
        ["Lignes contemporaines", ["images/products/lignes-contemporaines-01.webp"]],
        ["Matières naturelles", ["images/products/matieres-naturelles.webp"]],
        ["Lumière et douceur", [
          "images/products/lumiere-et-douceur-01.webp",
          "images/products/lumiere-et-douceur-02.webp",
          "images/products/lumiere-et-douceur-03.webp",
          "images/products/lumiere-et-douceur-04.webp",
          "images/products/lumiere-et-douceur-05.webp",
          "images/products/lumiere-et-douceur-06.webp",
          "images/products/lumiere-et-douceur-07.webp",
        ]],
        ["Élégance intemporelle", ["images/products/elegance-intemporelle.webp"]],
        ["Un coin à soi", ["images/products/un-coin-a-soi.webp"]],
        ["Canapé aux lignes douces", [
          "images/products/canape-aux-lignes-douces-01.webp",
          "images/products/canape-aux-lignes-douces-02.webp",
          "images/products/canape-aux-lignes-douces-03.webp",
          "images/products/canape-aux-lignes-douces-04.webp",
        ]],
        ["Fauteuil de lecture", [
          "images/products/fauteuil-de-lecture-01.webp",
          "images/products/fauteuil-de-lecture-02.webp",
          "images/products/fauteuil-de-lecture-03.webp",
          "images/products/fauteuil-de-lecture-04.webp",
          "images/products/fauteuil-de-lecture-05.webp",
          "images/products/fauteuil-de-lecture-06.webp",
        ]],
        ["Rangements épurés", ["images/products/rangements-epures.webp"]],
    ],
  },
  "salle-a-manger": {
    title: "La salle à manger",
    description: "Explorez des inspirations pour la salle à manger et repérez les meubles adaptés à votre espace. Les modèles, photos et disponibilités sont à confirmer auprès d’Inova.",
    inspirations: [
        ["Repas en lumière", ["images/products/repas-en-lumiere.webp"]],
        ["Table de caractère", ["images/products/table-de-caractere.webp"]],
        ["Matières chaleureuses", ["images/products/matieres-chaleureuses.webp"]],
        ["Esprit contemporain", ["images/products/esprit-contemporain.webp"]],
        ["Réception élégante", ["images/products/reception-elegante.webp"]],
        ["L’art de recevoir", ["images/products/art-de-recevoir.webp"]],
        ["Table conviviale", ["images/products/table-conviviale.webp"]],
        ["Buffet en bois clair", ["images/products/buffet-en-bois-clair.webp"]],
        ["Chaises contemporaines", ["images/products/chaises-contemporaines.webp"]],
    ],
  },
  chambre: {
    title: "La chambre",
    description: "Explorez des inspirations de mobilier pour la chambre : lits, tables de chevet et rangements. Les modèles, photos et disponibilités sont à confirmer auprès d’Inova.",
    inspirations: [
        ["Douceur naturelle", ["images/products/douceur-naturelle.webp"]],
        ["Repos tout en simplicité", ["images/products/repos-tout-en-simplicite.webp"]],
        ["Tons chaleureux", ["images/products/tons-chaleureux.webp"]],
        ["Lumière du matin", ["images/products/lumiere-du-matin.webp"]],
        ["Un cocon élégant", ["images/products/un-cocon-elegant.webp"]],
        ["Sérénité au quotidien", ["images/products/serenite-au-quotidien.webp"]],
        ["Lit aux tons naturels", ["images/products/lit-aux-tons-naturels.webp"]],
        ["Chevets tout en douceur", ["images/products/chevets-tout-en-douceur.webp"]],
        ["Rangements de chambre", ["images/products/rangements-de-chambre.webp"]],
    ],
  },
};

const categoryGallery = document.querySelector("#category-gallery");

if (categoryGallery) {
  const categoryKey = new URLSearchParams(window.location.search).get("category");
  const category = categoryKey ? categories[categoryKey] : undefined;
  const categoryTitle = document.querySelector("#category-title");
  const categoryDescription = document.querySelector("#category-description");
  const currentBreadcrumb = document.querySelector("#breadcrumb-current");
  const errorMessage = document.querySelector("#category-error");

  if (!category || !categoryKey) {
    if (errorMessage) {
      errorMessage.hidden = false;
    }
    categoryGallery.setAttribute("aria-label", "Catégorie introuvable");
  } else {
    document.title = `${category.title} — Inova`;
    if (categoryTitle) {
      categoryTitle.textContent = category.title;
    }
    if (categoryDescription) {
      categoryDescription.textContent = `${category.description} ${category.inspirations.length} inspirations sont à découvrir.`;
    }
    if (currentBreadcrumb) {
      currentBreadcrumb.textContent = category.title;
    }

    document.querySelectorAll(".category-tabs [data-category]").forEach((tab) => {
      if (tab.getAttribute("data-category") === categoryKey) {
        tab.classList.add("is-active");
        tab.setAttribute("aria-current", "page");
      }
    });

    category.inspirations.forEach((inspiration, index) => {
      const [name, images = []] = Array.isArray(inspiration) ? inspiration : [inspiration, []];
      const card = document.createElement("article");
      card.className = "inspiration-card";
      const productNumber = index + 1;
      const productUrl = `produit.html?category=${encodeURIComponent(categoryKey)}&product=${String(productNumber).padStart(2, "0")}`;
      const productLink = document.createElement("a");
      productLink.className = "inspiration-product-link";
      productLink.href = productUrl;
      productLink.setAttribute("aria-label", `Voir la fiche produit ${name}`);
      if (images.length > 0) {
        const image = document.createElement("img");
        image.className = "inspiration-product-image";
        image.src = images[0];
        image.alt = `${name} — ${category.title.toLowerCase()}`;
        image.loading = "lazy";
        productLink.append(image);
      } else {
        const imagePlaceholder = document.createElement("span");
        imagePlaceholder.className = "inspiration-image-placeholder";
        imagePlaceholder.setAttribute("aria-hidden", "true");
        productLink.append(imagePlaceholder);
      }
      const details = document.createElement("div");
      details.className = "inspiration-details";
      const text = document.createElement("div");
      const reference = document.createElement("p");
      reference.className = "inspiration-reference";
      reference.textContent = `Réf. inspiration IN-${categoryKey === "salle-a-manger" ? "SAM" : categoryKey === "chambre" ? "CH" : "SAL"}-${String(index + 1).padStart(2, "0")}`;
      const heading = document.createElement("h2");
      heading.textContent = name;
      text.append(reference, heading);
      const detailsLink = document.createElement("span");
      detailsLink.className = "details-link";
      detailsLink.textContent = "Voir l’inspiration";
      details.append(text, detailsLink);
      productLink.append(details);
      const actions = document.createElement("div");
      actions.className = "inspiration-actions";
      const link = document.createElement("a");
      link.className = "inspiration-link";
      link.href = `https://wa.me/33665201297?text=${encodeURIComponent(`Bonjour Inova, pouvez-vous me renseigner sur l'inspiration ${String(index + 1).padStart(2, "0")} pour ${category.title.toLowerCase()} ?`)}`;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.setAttribute("aria-label", `Demander des détails sur ${name}`);
      link.textContent = "↗";
      actions.append(link);
      card.append(productLink, actions);
      categoryGallery.append(card);
    });
  }
}

const productDetails = document.querySelector("#product-details");

if (productDetails) {
  const params = new URLSearchParams(window.location.search);
  const categoryKey = params.get("category");
  const productNumber = Number(params.get("product"));
  const category = categoryKey ? categories[categoryKey] : undefined;
  const inspiration = category && Number.isInteger(productNumber) ? category.inspirations[productNumber - 1] : undefined;
  const product = Array.isArray(inspiration) ? inspiration : inspiration ? [inspiration, []] : undefined;
  const errorMessage = document.querySelector("#product-error");
  const relatedSection = document.querySelector(".related-section");

  if (!category || !categoryKey || !product) {
    if (errorMessage) {
      errorMessage.hidden = false;
    }
    productDetails.hidden = true;
    if (relatedSection) {
      relatedSection.hidden = true;
    }
  } else {
    const referencePrefix = categoryKey === "salle-a-manger" ? "SAM" : categoryKey === "chambre" ? "CH" : "SAL";
    const reference = `IN-${referencePrefix}-${String(productNumber).padStart(2, "0")}`;
    const [name, productImages] = product;
    const productImageWrap = document.querySelector(".product-image-wrap");
    const categoryBreadcrumb = document.querySelector("#product-category-breadcrumb");
    const currentBreadcrumb = document.querySelector("#product-breadcrumb-current");
    const productCategory = document.querySelector("#product-category");
    const productTitle = document.querySelector("#product-title");
    const productReference = document.querySelector("#product-reference");
    const productDescription = document.querySelector("#product-description");
    const productContact = document.querySelector("#product-contact");
    const relatedProducts = document.querySelector("#related-products");
    const productBack = document.querySelector("#product-back");
    const relatedCategoryLink = document.querySelector("#related-category-link");

    document.title = `${name} — Inova`;
    if (productImageWrap) {
      productImageWrap.setAttribute("aria-label", `Photos de ${name}`);
      if (productImages.length > 0) {
        productImageWrap.replaceChildren();
        const gallery = document.createElement("div");
        gallery.className = "product-image-gallery";
        const mainImage = document.createElement("img");
        mainImage.className = "product-gallery-main-image";
        mainImage.src = productImages[0];
        mainImage.alt = `${name} — vue 1`;
        gallery.append(mainImage);

        if (productImages.length > 1) {
          const thumbnails = document.createElement("div");
          thumbnails.className = "product-image-thumbnails";
          thumbnails.setAttribute("aria-label", `Photos de ${name}`);
          productImages.forEach((imageUrl, index) => {
            const thumbnail = document.createElement("button");
            thumbnail.className = "product-image-thumbnail";
            thumbnail.type = "button";
            thumbnail.setAttribute("aria-label", `Afficher la photo ${index + 1} de ${name}`);
            thumbnail.setAttribute("aria-pressed", String(index === 0));
            const thumbnailImage = document.createElement("img");
            thumbnailImage.src = imageUrl;
            thumbnailImage.alt = "";
            thumbnailImage.loading = "lazy";
            thumbnail.append(thumbnailImage);
            thumbnail.addEventListener("click", () => {
              mainImage.src = imageUrl;
              mainImage.alt = `${name} — vue ${index + 1}`;
              thumbnails.querySelectorAll(".product-image-thumbnail").forEach((item) => {
                item.setAttribute("aria-pressed", String(item === thumbnail));
              });
            });
            thumbnails.append(thumbnail);
          });
          gallery.append(thumbnails);
        }

        productImageWrap.append(gallery);
      }
    }

    if (categoryBreadcrumb) {
      categoryBreadcrumb.textContent = category.title;
      categoryBreadcrumb.href = `categorie.html?category=${encodeURIComponent(categoryKey)}`;
    }
    if (productBack) {
      productBack.href = `categorie.html?category=${encodeURIComponent(categoryKey)}`;
    }
    if (relatedCategoryLink) {
      relatedCategoryLink.href = `categorie.html?category=${encodeURIComponent(categoryKey)}`;
    }
    if (currentBreadcrumb) {
      currentBreadcrumb.textContent = name;
    }
    if (productCategory) {
      productCategory.textContent = category.title;
    }
    if (productTitle) {
      productTitle.textContent = name;
    }
    if (productReference) {
      productReference.textContent = `Réf. inspiration ${reference}`;
    }
    if (productDescription) {
      productDescription.textContent = `${name} illustre une idée de mobilier pour votre intérieur. Contactez Inova pour découvrir les meubles disponibles dans la collection « ${category.title} », leurs dimensions et leurs prix.`;
    }
    if (productContact) {
      productContact.href = `https://wa.me/33665201297?text=${encodeURIComponent(`Bonjour Inova, cette inspiration mobilier m'intéresse (${reference}). Pouvez-vous m'indiquer les meubles disponibles, leurs dimensions et leurs prix ?`)}`;
    }

    category.inspirations.forEach((relatedInspiration, index) => {
      if (index + 1 === productNumber || relatedProducts.children.length >= 4) {
        return;
      }
      const [relatedName, relatedImages = []] = Array.isArray(relatedInspiration)
        ? relatedInspiration
        : [relatedInspiration, []];
      const link = document.createElement("a");
      link.className = "related-product";
      link.href = `produit.html?category=${encodeURIComponent(categoryKey)}&product=${String(index + 1).padStart(2, "0")}`;
      const relatedVisual = relatedImages.length > 0
        ? document.createElement("img")
        : document.createElement("span");
      if (relatedImages.length > 0) {
        relatedVisual.src = relatedImages[0];
        relatedVisual.alt = relatedName;
        relatedVisual.loading = "lazy";
      } else {
        relatedVisual.className = "related-image-placeholder";
        relatedVisual.setAttribute("aria-hidden", "true");
      }
      const title = document.createElement("span");
      title.textContent = relatedName;
      link.append(relatedVisual, title);
      relatedProducts.append(link);
    });
  }
}

const magnifier = document.createElement("div");
magnifier.className = "image-magnifier";
magnifier.setAttribute("aria-hidden", "true");
magnifier.hidden = true;
document.body.append(magnifier);

const magnifierSize = 176;
const magnification = 2.2;
let magnifiedImage = null;

document.querySelectorAll("img").forEach((image) => {
  image.classList.add("image-zoomable");
});

const hideMagnifier = () => {
  magnifier.hidden = true;
  magnifiedImage = null;
};

const updateMagnifier = (event) => {
  if (!magnifiedImage) {
    return;
  }

  const imageBounds = magnifiedImage.getBoundingClientRect();
  const imageX = Math.max(0, Math.min(event.clientX - imageBounds.left, imageBounds.width));
  const imageY = Math.max(0, Math.min(event.clientY - imageBounds.top, imageBounds.height));
  const lensX = Math.max(8, Math.min(event.clientX + 18, window.innerWidth - magnifierSize - 8));
  const lensY = Math.max(8, Math.min(event.clientY + 18, window.innerHeight - magnifierSize - 8));

  magnifier.style.left = `${lensX}px`;
  magnifier.style.top = `${lensY}px`;
  magnifier.style.backgroundImage = `url("${new URL(magnifiedImage.currentSrc || magnifiedImage.src, document.baseURI).href}")`;
  magnifier.style.backgroundSize = `${imageBounds.width * magnification}px ${imageBounds.height * magnification}px`;
  magnifier.style.backgroundPosition = `${magnifierSize / 2 - imageX * magnification}px ${magnifierSize / 2 - imageY * magnification}px`;
};

document.addEventListener("pointerover", (event) => {
  if (event.pointerType !== "mouse" || !(event.target instanceof HTMLImageElement)) {
    return;
  }

  const imageBounds = event.target.getBoundingClientRect();
  if (imageBounds.width < 80 || imageBounds.height < 80) {
    return;
  }

  magnifiedImage = event.target;
  magnifier.hidden = false;
  updateMagnifier(event);
});

document.addEventListener("pointermove", (event) => {
  if (event.pointerType === "mouse" && magnifiedImage) {
    updateMagnifier(event);
  }
});

document.addEventListener("pointerout", (event) => {
  if (event.target === magnifiedImage) {
    hideMagnifier();
  }
});

window.addEventListener("scroll", hideMagnifier, { passive: true });
window.addEventListener("resize", hideMagnifier);
