const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

let inspirationImageDatabase;

const getInspirationImageDatabase = () => {
  if (!("indexedDB" in window)) {
    return Promise.reject(new Error("Le stockage d’images n’est pas disponible dans ce navigateur."));
  }
  if (!inspirationImageDatabase) {
    inspirationImageDatabase = new Promise((resolve, reject) => {
      const request = window.indexedDB.open("inova-inspiration-images", 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore("images", { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Impossible d’ouvrir le stockage des images."));
    });
  }
  return inspirationImageDatabase;
};

const getInspirationImageId = (categoryKey, productNumber) => `${categoryKey}-${productNumber}`;

const getSavedInspirationImage = async (categoryKey, productNumber) => {
  const database = await getInspirationImageDatabase();
  return new Promise((resolve, reject) => {
    const request = database
      .transaction("images", "readonly")
      .objectStore("images")
      .get(getInspirationImageId(categoryKey, productNumber));
    request.onsuccess = () => resolve(request.result?.image);
    request.onerror = () => reject(request.error || new Error("Impossible de charger l’image enregistrée."));
  });
};

const saveInspirationImage = async (categoryKey, productNumber, image) => {
  const database = await getInspirationImageDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("images", "readwrite");
    transaction.objectStore("images").put({
      id: getInspirationImageId(categoryKey, productNumber),
      image,
    });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("Impossible d’enregistrer l’image."));
    transaction.onabort = () => reject(transaction.error || new Error("L’enregistrement de l’image a été annulé."));
  });
};

const removeSavedInspirationImage = async (categoryKey, productNumber) => {
  const database = await getInspirationImageDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("images", "readwrite");
    transaction.objectStore("images").delete(getInspirationImageId(categoryKey, productNumber));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("Impossible de rétablir l’image d’origine."));
    transaction.onabort = () => reject(transaction.error || new Error("Le rétablissement de l’image a été annulé."));
  });
};

const showSavedInspirationImage = async (imageElement, categoryKey, productNumber) => {
  const savedImage = await getSavedInspirationImage(categoryKey, productNumber);
  if (savedImage) {
    imageElement.src = URL.createObjectURL(savedImage);
  }
  return Boolean(savedImage);
};

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
    description: "Explorez des inspirations de mobilier pour le salon : assises, tables basses et rangements. Les modèles et disponibilités sont à confirmer auprès d’Inova.",
    inspirations: [
        ["Salon convivial", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85"],
        ["Lignes contemporaines", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85"],
        ["Matières naturelles", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85"],
        ["Lumière et douceur", "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85"],
        ["Élégance intemporelle", "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85"],
        ["Un coin à soi", "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1000&q=85"],
        ["Canapé aux lignes douces", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85"],
        ["Fauteuil de lecture", "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1000&q=85"],
        ["Rangements épurés", "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=85"],
    ],
  },
  "salle-a-manger": {
    title: "La salle à manger",
    description: "Explorez des inspirations pour la salle à manger et repérez les meubles adaptés à votre espace. Les modèles et disponibilités sont à confirmer auprès d’Inova.",
    inspirations: [
        ["Repas en lumière", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85"],
        ["Table de caractère", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85"],
        ["Matières chaleureuses", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85"],
        ["Esprit contemporain", "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85"],
        ["Réception élégante", "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85"],
        ["L’art de recevoir", "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1000&q=85"],
        ["Table conviviale", "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1000&q=85"],
        ["Buffet en bois clair", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85"],
        ["Chaises contemporaines", "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=85"],
    ],
  },
  chambre: {
    title: "La chambre",
    description: "Explorez des inspirations de mobilier pour la chambre : lits, tables de chevet et rangements. Les modèles et disponibilités sont à confirmer auprès d’Inova.",
    inspirations: [
        ["Douceur naturelle", "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85"],
        ["Repos tout en simplicité", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85"],
        ["Tons chaleureux", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85"],
        ["Lumière du matin", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85"],
        ["Un cocon élégant", "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85"],
        ["Sérénité au quotidien", "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1000&q=85"],
        ["Lit aux tons naturels", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85"],
        ["Chevets tout en douceur", "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=85"],
        ["Rangements de chambre", "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=85"],
    ],
  },
};

document.querySelectorAll(".collection-card[href*='category=']").forEach((card) => {
  const categoryKey = new URL(card.href).searchParams.get("category");
  const image = card.querySelector("img");
  if (!categoryKey || !image) {
    return;
  }
  showSavedInspirationImage(image, categoryKey, 1).catch(() => {
    const imageStatus = document.createElement("span");
    imageStatus.className = "collection-image-status";
    imageStatus.setAttribute("role", "status");
    imageStatus.textContent = "Impossible de charger l’image personnalisée.";
    card.append(imageStatus);
  });
});

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
      categoryDescription.textContent = `${category.description} ${category.inspirations.length} inspirations sont à découvrir. Utilisez « Changer l’image » sous une fiche pour choisir une photo enregistrée sur cet appareil.`;
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

    category.inspirations.forEach(([name, imageUrl], index) => {
      const card = document.createElement("article");
      card.className = "inspiration-card";
      const productNumber = index + 1;
      const productUrl = `produit.html?category=${encodeURIComponent(categoryKey)}&product=${String(productNumber).padStart(2, "0")}`;
      const productLink = document.createElement("a");
      productLink.className = "inspiration-product-link";
      productLink.href = productUrl;
      productLink.setAttribute("aria-label", `Voir la fiche produit ${name}`);
      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = `${name} — inspiration ${category.title.toLowerCase()}`;
      image.loading = "lazy";
      productLink.append(image);
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
      const imageControls = document.createElement("div");
      imageControls.className = "inspiration-image-controls";
      const changeImage = document.createElement("button");
      changeImage.className = "change-image-button";
      changeImage.type = "button";
      changeImage.textContent = "Changer l’image";
      changeImage.setAttribute("aria-label", `Changer l’image de ${name}`);
      const imageInput = document.createElement("input");
      imageInput.className = "inspiration-image-input";
      imageInput.type = "file";
      imageInput.accept = "image/jpeg,image/png,image/webp";
      imageInput.tabIndex = -1;
      imageInput.setAttribute("aria-label", `Choisir une nouvelle image pour ${name}`);
      const imageStatus = document.createElement("span");
      imageStatus.className = "inspiration-image-status";
      imageStatus.setAttribute("role", "status");
      imageStatus.setAttribute("aria-live", "polite");
      const resetImage = document.createElement("button");
      resetImage.className = "reset-image-button";
      resetImage.type = "button";
      resetImage.textContent = "Rétablir l’image";
      resetImage.hidden = true;

      showSavedInspirationImage(image, categoryKey, productNumber)
        .then((hasSavedImage) => {
          resetImage.hidden = !hasSavedImage;
        })
        .catch(() => {
          imageStatus.textContent = "Impossible de charger l’image enregistrée.";
        });

      changeImage.addEventListener("click", () => imageInput.click());
      imageInput.addEventListener("change", async () => {
        const selectedImage = imageInput.files?.[0];
        if (!selectedImage) {
          return;
        }
        if (!["image/jpeg", "image/png", "image/webp"].includes(selectedImage.type)) {
          imageStatus.textContent = "Choisissez une image JPG, PNG ou WebP.";
          imageInput.value = "";
          return;
        }
        if (selectedImage.size > 10 * 1024 * 1024) {
          imageStatus.textContent = "L’image doit faire 10 Mo ou moins.";
          imageInput.value = "";
          return;
        }
        try {
          await saveInspirationImage(categoryKey, productNumber, selectedImage);
          image.src = URL.createObjectURL(selectedImage);
          imageStatus.textContent = "Image enregistrée sur cet appareil.";
          resetImage.hidden = false;
        } catch (error) {
          imageStatus.textContent = error instanceof Error ? error.message : "Impossible d’enregistrer cette image.";
        }
        imageInput.value = "";
      });
      resetImage.addEventListener("click", async () => {
        try {
          await removeSavedInspirationImage(categoryKey, productNumber);
          image.src = imageUrl;
          imageStatus.textContent = "Image d’origine rétablie.";
          resetImage.hidden = true;
        } catch (error) {
          imageStatus.textContent = error instanceof Error ? error.message : "Impossible de rétablir l’image d’origine.";
        }
      });
      imageControls.append(changeImage, imageInput, resetImage, imageStatus);

      const link = document.createElement("a");
      link.className = "inspiration-link";
      link.href = `https://wa.me/33665201297?text=${encodeURIComponent(`Bonjour Inova, pouvez-vous me renseigner sur l'inspiration ${String(index + 1).padStart(2, "0")} pour ${category.title.toLowerCase()} ?`)}`;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.setAttribute("aria-label", `Demander des détails sur ${name}`);
      link.textContent = "↗";
      actions.append(imageControls, link);
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
  const product = category && Number.isInteger(productNumber) ? category.inspirations[productNumber - 1] : undefined;
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
    const [name, imageUrl] = product;
    const productImage = document.querySelector("#product-image");
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
    if (productImage) {
      productImage.src = imageUrl;
      productImage.alt = `${name}, inspiration pour ${category.title.toLowerCase()}`;
      showSavedInspirationImage(productImage, categoryKey, productNumber).catch(() => {
        const imageStatus = document.createElement("p");
        imageStatus.className = "product-image-status";
        imageStatus.setAttribute("role", "status");
        imageStatus.textContent = "Impossible de charger une image personnalisée.";
        productImage.parentElement?.append(imageStatus);
      });
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

    category.inspirations.forEach(([relatedName, relatedImage], index) => {
      if (index + 1 === productNumber || relatedProducts.children.length >= 4) {
        return;
      }
      const link = document.createElement("a");
      link.className = "related-product";
      link.href = `produit.html?category=${encodeURIComponent(categoryKey)}&product=${String(index + 1).padStart(2, "0")}`;
      const image = document.createElement("img");
      image.alt = relatedName;
      image.loading = "lazy";
      showSavedInspirationImage(image, categoryKey, index + 1)
        .then((hasSavedImage) => {
          if (!hasSavedImage) {
            image.src = relatedImage.replace("w=1400", "w=700");
          }
        })
        .catch(() => {
          image.src = relatedImage.replace("w=1400", "w=700");
          const imageStatus = document.createElement("span");
          imageStatus.className = "related-image-status";
          imageStatus.setAttribute("role", "status");
          imageStatus.textContent = "Impossible de charger l’image personnalisée.";
          link.append(imageStatus);
        });
      const title = document.createElement("span");
      title.textContent = relatedName;
      link.append(image, title);
      relatedProducts.append(link);
    });
  }
}
