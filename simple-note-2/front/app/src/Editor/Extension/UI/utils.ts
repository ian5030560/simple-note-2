export function inside(x: number, y: number, element: HTMLElement) {
    const { x: ex, y: ey, width, height } = element.getBoundingClientRect();
    return x >= ex && x <= ex + width && y >= ey && y <= ey + height
}