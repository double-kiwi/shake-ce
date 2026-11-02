export interface MenuNode {
    id: string;
    name: string;
    children: MenuNode[];
    data: Record<string, any>;
    isVisible: boolean;
    isEnabled: boolean;
}
