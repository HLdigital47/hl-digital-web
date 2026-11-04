/* Fuente única de tarifas y equivalencias comerciales (USD). */
window.HL_RATES = {
  "packages": {
    "impulso": {
      "name": "Impulso Digital",
      "price": 449,
      "web": "landing",
      "gbp": true,
      "seo": false,
      "included": [
        "Landing page",
        "Google Business Profile",
        "SEO básico y buscadores"
      ]
    },
    "profesional": {
      "name": "Presencia Profesional",
      "price": 799,
      "web": "web",
      "gbp": true,
      "seo": false,
      "included": [
        "Web hasta cinco páginas",
        "Google Business Profile",
        "SEO técnico y local inicial",
        "Analytics y buscadores"
      ]
    },
    "crecimiento": {
      "name": "Crecimiento Local",
      "price": 999,
      "web": "web",
      "gbp": true,
      "seo": true,
      "included": [
        "Web hasta cinco páginas",
        "Google Business Profile",
        "Auditoría SEO local",
        "Contenido de servicios",
        "Formulario con notificaciones",
        "QR de reseñas",
        "Analítica y buscadores"
      ],
      "monthly": "crecimiento"
    }
  },
  "web": {
    "none": {
      "name": "Sin página web",
      "price": 0
    },
    "landing": {
      "name": "Landing Page Profesional",
      "price": 349
    },
    "web": {
      "name": "Página Web Profesional",
      "price": 749
    }
  },
  "gbp": {
    "name": "Creación u optimización de Google Business Profile",
    "price": 129
  },
  "seo": {
    "name": "Auditoría SEO local",
    "price": 79
  },
  "extras": {
    "logo": {
      "name": "Diseño de logotipo básico",
      "price": 99
    },
    "identity": {
      "name": "Identidad visual básica",
      "price": 199
    },
    "links": {
      "name": "Página de enlaces personalizada",
      "price": 79
    },
    "whatsapp": {
      "name": "Configuración de WhatsApp Business",
      "price": 69
    },
    "automation": {
      "name": "Automatización sencilla de un formulario",
      "price": 99
    },
    "catalog": {
      "name": "Catálogo web sencillo",
      "price": 249,
      "from": true
    },
    "email": {
      "name": "Configuración de correo profesional",
      "price": 49,
      "external": true
    }
  },
  "monthly": {
    "none": {
      "name": "Sin mantenimiento",
      "price": 0
    },
    "impulso": {
      "name": "Impulso",
      "price": 79
    },
    "profesional": {
      "name": "Profesional",
      "price": 129
    },
    "crecimiento": {
      "name": "Crecimiento",
      "price": 199
    }
  },
  "individual": {
    "additionalPage": 129,
    "analytics": 79
  },
  "comparison": {
    "services": {
      "landing": {
        "label": "Landing Page Profesional",
        "rate": "web.landing",
        "capabilities": [
          "landing",
          "responsive",
          "contact",
          "basicSeo",
          "form"
        ]
      },
      "web": {
        "label": "Página Web Profesional",
        "rate": "web.web",
        "capabilities": [
          "web",
          "responsive",
          "contact",
          "technicalSeo",
          "form",
          "analytics",
          "searchTools"
        ]
      },
      "gbp": {
        "label": "Google Business Profile",
        "rate": "gbp",
        "capabilities": [
          "gbp"
        ]
      },
      "audit": {
        "label": "Auditoría SEO local",
        "rate": "seo",
        "capabilities": [
          "audit"
        ]
      }
    },
    "packages": {
      "impulso": {
        "equivalentServices": [
          "gbp"
        ],
        "requiresConfirmation": [
          "landing"
        ],
        "capabilities": [
          "landing",
          "responsive",
          "contact",
          "basicSeo",
          "searchTools",
          "gbp"
        ],
        "note": "El paquete Impulso no detalla un formulario en su alcance aprobado. Confirma ese alcance antes de compararlo con la landing individual, que sí lo incluye."
      },
      "profesional": {
        "equivalentServices": [
          "web",
          "gbp"
        ],
        "requiresConfirmation": [],
        "capabilities": [
          "web",
          "responsive",
          "contact",
          "technicalSeo",
          "form",
          "analytics",
          "searchTools",
          "gbp",
          "initialLocalSeo"
        ]
      },
      "crecimiento": {
        "equivalentServices": [
          "web",
          "gbp",
          "audit"
        ],
        "requiresConfirmation": [],
        "capabilities": [
          "web",
          "responsive",
          "contact",
          "technicalSeo",
          "form",
          "analytics",
          "searchTools",
          "gbp",
          "initialLocalSeo",
          "audit",
          "serviceContent",
          "emailNotifications",
          "reviewQr"
        ]
      }
    },
    "capabilityLabels": {
      "searchTools": "Configuración de buscadores",
      "initialLocalSeo": "SEO local inicial",
      "serviceContent": "Optimización de contenido de servicios",
      "emailNotifications": "Notificaciones del formulario por correo",
      "reviewQr": "Código QR para reseñas"
    },
    "includedExtras": {
      "impulso": [],
      "profesional": [],
      "crecimiento": []
    },
    "automationNote": "Las notificaciones del formulario incluidas en Crecimiento Local no equivalen por sí solas a una automatización personalizada. Esta última se cotiza como extra con su propio alcance."
  }
};
