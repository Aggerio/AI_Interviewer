import React from "react";
import AnimatedLink from "./AnimatedLink";

const navLink = [
    { title: "What we do", href: "/" },
    { title: "How it works", href: "/" },
    { title: "Case studies", href: "/" },
    { title: "About", href: "/" },
    { title: "Contact", href: "/" },

];
export default function page() {
    return (
        <>
            <div className="flex items-start pt-32 h-screen
        uppercase justify-between text-xl w-full">
                {navLink.map((link, i) => {
                    return (
                        <div className="border relative overflow-hidden
                    ">
                            <AnimatedLink title={link.title} />
                        </div>
                    );
                })}
            </div>
        </>
    );
}