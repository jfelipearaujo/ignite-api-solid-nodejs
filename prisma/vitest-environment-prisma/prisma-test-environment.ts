import { Environment } from "vitest";

export default <Environment>{
    name: "prisma",
    async setup() {
        console.log("setup prisma");

        return {
            async teardown() {
                console.log("teardown prisma");
            },
        };
    },
};
