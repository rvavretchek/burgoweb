import axe from "axe-core";

const test = it;

const tenantId = "11111111-1111-4111-8111-111111111111";
const grantId = "77777777-7777-4777-8777-777777777777";
const peopleUrl = `/condominios/${tenantId}/pessoas`;
const capabilitiesApi = `**/api/v1/tenants/${tenantId}/capability-grants`;
const roleAssignmentsApi = `**/api/v1/tenants/${tenantId}/role-assignments`;

const auxiliar = {
  publicId: "22222222-2222-4222-8222-222222222222",
  fullName: "Ana Lima",
};
const catalog = [
  {
    id: "roles.suspend",
    domain: "Papéis",
    action: "Suspender em urgência",
    grants: "Suspender temporariamente o Papel subordinado de outra Pessoa.",
    denies: "Não permite restaurar, revogar permanentemente nem afetar o Síndico.",
    available: true,
  },
  {
    id: "financial.entries.manage",
    domain: "Financeiro",
    action: "Lançamentos",
    grants: "Registrar e corrigir lançamentos financeiros.",
    denies: "Ainda não disponível nesta versão do Burgoweb.",
    available: false,
  },
];
const roleAssignment = {
  publicId: "55555555-5555-4555-8555-555555555555",
  personPublicId: auxiliar.publicId,
  role: "administrative-assistant",
  scope: { type: "tenant" },
  validFrom: "2026-08-10T12:00:00Z",
  validUntil: null,
  state: "active",
  version: 1,
};
const grant = {
  publicId: grantId,
  personPublicId: auxiliar.publicId,
  capabilityId: "roles.suspend",
  validFrom: "2026-08-10T12:00:00Z",
  validUntil: null,
  state: "active",
  version: 1,
};

function interceptShell() {
  cy.intercept("GET", "**/api/v1/auth/session", {
    body: { authenticated: true, csrfToken: "csrf" },
  }).as("session");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/dashboard`, {
    body: {
      condominium: {
        publicId: tenantId,
        displayName: "Residencial Sol",
        timeZone: "America/Sao_Paulo",
      },
      state: "ready",
      actions: [],
    },
  }).as("dashboard");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/people*`, {
    body: { items: [auxiliar] },
  }).as("people");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/units*`, {
    body: { items: [] },
  }).as("units");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/relationships*`, {
    body: { items: [] },
  }).as("relationships");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/invitations*`, {
    body: { items: [] },
  }).as("invitations");
  cy.intercept("GET", `${roleAssignmentsApi}*`, {
    body: {
      items: [roleAssignment],
      viewerPersonPublicId: "66666666-6666-4666-8666-666666666666",
      viewerCapabilities: [
        "roles.read",
        "roles.preview",
        "roles.grant",
        "roles.suspend",
        "roles.restore",
        "roles.revoke",
      ],
    },
  }).as("roleAssignments");
}

function visitWithCapabilities(items) {
  interceptShell();
  cy.intercept("GET", `${capabilitiesApi}*`, {
    body: { items, catalog, viewerCapabilities: ["capabilities.grant"] },
  }).as("capabilityGrants");
  cy.visit(peopleUrl);
  cy.wait("@roleAssignments");
  cy.wait("@capabilityGrants");
}

function getNamedControl(name) {
  return cy.get(`[aria-label="${name}"], [name="${name}"]`).last();
}

function assertNoSeriousAxeViolations() {
  cy.window().then(async (win) => {
    win.eval(
      `var exports={};var module={exports:exports};${axe.source};window.axe=module.exports;`,
    );
    const result = await win.axe.run(win.document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
      },
    });
    expect(
      result.violations.filter(
        ({ impact }) => impact === "critical" || impact === "serious",
      ),
    ).to.deep.equal([]);
  });
}

describe("Story 1.9 — delegação de capacidades ao Auxiliar Administrativo", () => {
  test("[P0] apresenta catálogo agrupado distinguindo disponíveis de ainda não disponíveis", () => {
    visitWithCapabilities([]);
    cy.contains("Capacidades delegadas").should("be.visible");
    cy.contains("Catálogo de capacidades").should("be.visible");
    cy.contains("Suspender em urgência").should("be.visible");
    cy.contains("Lançamentos").should("be.visible");
    cy.contains("(ainda não disponível)").should("be.visible");
  });

  test("[P0] revisa e delega capacidade com risco explícito antes de confirmar", () => {
    cy.intercept("POST", capabilitiesApi, {
      statusCode: 201,
      body: grant,
    }).as("grantCapability");
    visitWithCapabilities([]);

    cy.contains("button", "Delegar capacidade").click();
    getNamedControl("personPublicId").select(auxiliar.publicId);
    getNamedControl("capabilityId").select("roles.suspend");
    getNamedControl("validFrom").type("2026-08-11T09:00");
    cy.contains("button", "Revisar delegação").click();
    cy.get('[role="dialog"]')
      .should("have.attr", "aria-label", "Revisar delegação de capacidade")
      .within(() => {
        cy.contains("Ana Lima").should("be.visible");
        cy.contains("O que passa a permitir").should("be.visible");
        cy.contains("Suspender temporariamente o Papel subordinado").should(
          "be.visible",
        );
        cy.contains("O que continua negado").should("be.visible");
        cy.contains("button", "Confirmar delegação de capacidade").click();
      });
    cy.wait("@grantCapability");
    cy.get('[role="status"]').should("contain.text", "Capacidade concedida");
  });

  test("[P0] revoga capacidade com confirmação nomeando a ação e o efeito", () => {
    cy.intercept("POST", `${capabilitiesApi}/${grantId}/revoke`, {
      body: { ...grant, state: "revoked", version: 2 },
    }).as("revokeCapability");
    visitWithCapabilities([grant]);

    cy.contains("button", "Revogar capacidade de Ana Lima").click();
    cy.get('[role="dialog"]').within(() => {
      cy.contains("Revogar capacidade permanentemente").should("be.visible");
      cy.contains("deixará de autorizar imediatamente").should("be.visible");
      cy.contains("button", "Confirmar revogação de capacidade").click();
    });
    cy.wait("@revokeCapability")
      .its("request.body")
      .should("include", { expectedVersion: 1 });
    cy.contains("Revogada").should("be.visible");
  });

  test("[P1] preserva intenção quando a versão concorrente causa conflito", () => {
    cy.intercept("POST", `${capabilitiesApi}/${grantId}/revoke`, {
      statusCode: 409,
      body: {
        type: "conflict",
        title: "Capacidade alterada",
        status: 409,
        detail: "Revise o estado atual.",
        current: { publicId: grantId, state: "revoked", version: 2 },
      },
    }).as("capabilityConflict");
    visitWithCapabilities([grant]);

    cy.contains("button", "Revogar capacidade de Ana Lima").click();
    cy.contains("button", "Confirmar revogação de capacidade").click();
    cy.wait("@capabilityConflict");
    cy.get('[role="alert"]')
      .should("contain.text", "Revise o estado atual")
      .and("be.focused");
    cy.contains("Revogada").should("be.visible");
  });

  test("[P1] remove conteúdo sensível após perda concorrente de acesso", () => {
    cy.intercept("POST", `${capabilitiesApi}/${grantId}/revoke`, {
      statusCode: 403,
      body: {
        type: "forbidden",
        title: "Acesso indisponível",
        status: 403,
        detail: "Não foi possível concluir esta ação.",
      },
    }).as("accessLost");
    visitWithCapabilities([grant]);

    cy.contains("button", "Revogar capacidade de Ana Lima").click();
    cy.contains("button", "Confirmar revogação de capacidade").click();
    cy.wait("@accessLost");
    cy.url().should("not.include", "/pessoas");
    cy.get("body").should("not.contain.text", "Ana Lima");
  });

  test("[P1] mantém foco e operação completa por teclado", () => {
    visitWithCapabilities([grant]);
    cy.contains("button", "Revogar capacidade de Ana Lima").focus();
    cy.get("body").type("{esc}");
    cy.contains("button", "Delegar capacidade")
      .focus()
      .type("{enter}");
    cy.get('[role="dialog"]').should("be.visible");
    cy.get("body").type("{esc}");
    cy.get('[role="dialog"]').should("not.exist");
  });

  test("[P0] Auxiliar sem capabilities.grant vê somente suas próprias capacidades, sem ações de gestão", () => {
    interceptShell();
    cy.intercept("GET", `${capabilitiesApi}*`, {
      body: { items: [grant], catalog, viewerCapabilities: ["roles.read"] },
    }).as("capabilityGrantsSelf");
    cy.visit(peopleUrl);
    cy.wait("@roleAssignments");
    cy.wait("@capabilityGrantsSelf");
    cy.contains("Você está vendo somente as capacidades delegadas a você.").should(
      "be.visible",
    );
    cy.contains("button", "Delegar capacidade").should("not.exist");
    cy.contains("button", "Revogar capacidade de Ana Lima").should("not.exist");
  });

  test("[P1] suporta reflow em 320 px e não tem violações axe críticas", () => {
    cy.viewport(320, 800);
    visitWithCapabilities([grant]);
    cy.contains("h2", "Capacidades delegadas").should("be.visible");
    cy.document().then((document) =>
      expect(document.documentElement.scrollWidth).to.be.at.most(640),
    );
    assertNoSeriousAxeViolations();
  });
});
