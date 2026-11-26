import { describe, expect, it } from "vitest";
import { addTodo, countTodos, deleteTodo, filterTodos, toggleTodo } from "../js/todo-logic.js";

describe("todo-logic pure functions", () => {
    it("adds a new todo without mutating the original array", () => {
        const original = [{ id: 1, text: "Read docs", completed: false, createdAt: "2026-01-01T00:00:00.000Z" }];
        const snapshot = JSON.parse(JSON.stringify(original));

        const updated = addTodo(original, "  Write tests  ", 2, "2026-01-02T00:00:00.000Z");

        expect(original).toEqual(snapshot);
        expect(updated).toHaveLength(2);
        expect(updated[1]).toEqual({
            id: 2,
            text: "Write tests",
            completed: false,
            createdAt: "2026-01-02T00:00:00.000Z",
        });
    });

    it("ignores empty or whitespace-only text when adding a todo", () => {
        const todos = [{ id: 1, text: "Keep me", completed: false, createdAt: "2026-01-01T00:00:00.000Z" }];

        const resultEmpty = addTodo(todos, "");
        const resultSpaces = addTodo(todos, "    ");

        expect(resultEmpty).toEqual(todos);
        expect(resultSpaces).toEqual(todos);
    });

    it("toggles a matching todo and safely handles a non-existent id", () => {
        const todos = [
            { id: 10, text: "Task A", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
            { id: 20, text: "Task B", completed: true, createdAt: "2026-01-01T00:00:00.000Z" },
        ];

        const toggled = toggleTodo(todos, 10);
        expect(toggled[0].completed).toBe(true);
        expect(toggled[1].completed).toBe(true);

        const missingIdResult = toggleTodo(todos, 999999);
        expect(missingIdResult).toEqual(todos);
    });

    it("deletes a todo by id and works cleanly on an empty list or missing id", () => {
        const todos = [
            { id: 1, text: "First", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
            { id: 2, text: "Second", completed: true, createdAt: "2026-01-01T00:00:00.000Z" },
        ];

        const afterDelete = deleteTodo(todos, 1);
        expect(afterDelete).toHaveLength(1);
        expect(afterDelete[0].id).toBe(2);

        expect(deleteTodo(todos, 404)).toEqual(todos);
        expect(deleteTodo([], 1)).toEqual([]);
    });

    it("filters and counts active, completed, and total todos accurately", () => {
        const todos = [
            { id: 1, text: "Active 1", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
            { id: 2, text: "Done 1", completed: true, createdAt: "2026-01-01T00:00:00.000Z" },
            { id: 3, text: "Active 2", completed: false, createdAt: "2026-01-01T00:00:00.000Z" },
        ];

        expect(filterTodos(todos, "all")).toHaveLength(3);
        expect(filterTodos(todos, "active")).toEqual([todos[0], todos[2]]);
        expect(filterTodos(todos, "completed")).toEqual([todos[1]]);

        expect(countTodos(todos)).toEqual({
            total: 3,
            active: 2,
            completed: 1,
        });
        expect(countTodos([])).toEqual({
            total: 0,
            active: 0,
            completed: 0,
        });
    });
});
