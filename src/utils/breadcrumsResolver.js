// src/utils/breadcrumbResolver.ts
import { matchPath } from "react-router-dom";
import { BREADCRUMBS } from "../config/breadcrumbs";
export function resolveBreadcrumbs(pathname) {
    const crumbs = [];
    Object.entries(BREADCRUMBS).forEach(([route, crumb]) => {
        if (matchPath({ path: route, end: false }, pathname)) {
            crumbs.push(crumb);
        }
    });
    return crumbs;
}
