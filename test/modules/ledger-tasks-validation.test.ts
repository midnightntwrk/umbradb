import { describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { CALL_ARGS_TASK, callArgsModule, STATE_BEFORE_TASK, stateBeforeModule } from "../ledger/fixtures/task-modules.js";
import { userModules } from "./declarations.js";

// Validation of a module's `ledgerTasks`, applied also to a declaration built without types:
// - the field is a list of `{ name, needsState, run }`, each task naming one of the module's `block` items once;
// - a module with tasks requires `block-parsed`;
// - a module with a task that needs the state requires `ledger-state`, so the graph refuses it where
//   `core-ledger-state` is not active [A137];
// - a private module has no tasks.
// Each refusal is `invalid-declaration`, naming the field. [LG-17, MD-1, MD-2; design §5.5]

/** The refusal of validating `declaration` alone as a user module. */
function refusal(declaration: unknown): UmbraError {
  try {
    validateDeclarations(userModules([declaration]));
  } catch (error) {
    if (error instanceof UmbraError) return error;
    throw error;
  }
  return expect.unreachable("expected a refusal");
}

const changed = (change: (d: Record<string, unknown>) => void, from: ModuleDeclaration = callArgsModule()): Record<string, unknown> => {
  const d = { ...from } as unknown as Record<string, unknown>;
  change(d);
  return d;
};

describe("ledgerTasks in a declaration (task 12.6; LG-17, MD-1)", () => {
  it("accepts a module's tasks, with or without the state, and a module without any", () => {
    const modules = [
      callArgsModule(),
      stateBeforeModule(),
      changed((d) => void ((d.id = "no-tasks"), (d.ledgerTasks = []))),
      changed((d) => void ((d.id = "no-task-list"), delete d.ledgerTasks)),
    ];
    expect(validateDeclarations(userModules(modules)).user).toEqual(modules);
  });

  const cases: { name: string; build: () => unknown; field: string; says: string }[] = [
    { name: "not a list", build: () => changed((d) => void (d.ledgerTasks = CALL_ARGS_TASK)), field: "ledgerTasks", says: "a list of ledger tasks" },
    { name: "a task that is not an object", build: () => changed((d) => void (d.ledgerTasks = ["call-arguments"])), field: "ledgerTasks[0]", says: "a ledger task" },
    { name: "a task with an unknown property", build: () => changed((d) => void (d.ledgerTasks = [{ ...CALL_ARGS_TASK, item: "x" }])), field: "ledgerTasks[0].item", says: "name, needsState, run" },
    { name: "a task without its name", build: () => changed((d) => void (d.ledgerTasks = [{ needsState: false, run: () => 1 }])), field: "ledgerTasks[0].name", says: "a string" },
    { name: "a task whose needsState is not a boolean", build: () => changed((d) => void (d.ledgerTasks = [{ ...CALL_ARGS_TASK, needsState: "no" }])), field: "ledgerTasks[0].needsState", says: "true or false" },
    { name: "a task without its function", build: () => changed((d) => void (d.ledgerTasks = [{ name: "call-arguments", needsState: false }])), field: "ledgerTasks[0].run", says: "a function" },
    {
      name: "a task naming no item of the module",
      build: () => changed((d) => void (d.ledgerTasks = [{ ...CALL_ARGS_TASK, name: "other" }])),
      field: "ledgerTasks[0].name",
      says: 'names no block item the module provides: a task\'s result becomes the module\'s block item of its name; provide { name: "other", lifetimes: ["block"] }',
    },
    {
      name: "a task naming an item without the block lifetime",
      build: () => changed((d) => void (d.provides = [{ name: "call-arguments", lifetimes: ["process"] }])),
      field: "ledgerTasks[0].name",
      says: "names no block item",
    },
    {
      name: "a task declared twice",
      build: () => changed((d) => void (d.ledgerTasks = [CALL_ARGS_TASK, CALL_ARGS_TASK])),
      field: "ledgerTasks[1].name",
      says: "declares the ledger task call-arguments twice (ledgerTasks[0] and ledgerTasks[1])",
    },
    {
      name: "a task that needs the state in a module that does not require ledger-state",
      build: () => changed((d) => void (d.requires = ["block-parsed"]), stateBeforeModule()),
      field: "ledgerTasks[0].needsState",
      says: "does not require ledger-state: it must, so that the graph refuses it where core-ledger-state is not active",
    },
    {
      name: "a module with tasks that does not require block-parsed",
      build: () => changed((d) => void (d.requires = ["chain-events"])),
      field: "requires",
      says: "declares ledger tasks and does not require block-parsed",
    },
    {
      name: "a private module with tasks",
      build: () => changed((d) => void (d.side = "private")),
      field: "ledgerTasks",
      says: "is a private module and declares ledger tasks: a private process has no ledger worker",
    },
  ];
  for (const c of cases) {
    it(`refuses ${c.name} (invalid-declaration)`, () => {
      const error = refusal(c.build());
      expect(error.code).toBe("invalid-declaration");
      expect(error.details).toMatchObject({ origin: "user", index: 0, field: c.field });
      expect(error.message).toContain(c.says);
    });
  }

  it("names the task's item, as its result becomes it, also for a task that needs the state", () => {
    expect(STATE_BEFORE_TASK.name).toBe("root-before");
    expect(stateBeforeModule().provides.map((item) => item.name)).toEqual(["root-before"]);
  });
});
