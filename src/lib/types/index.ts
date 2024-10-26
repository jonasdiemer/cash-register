export interface Product {
    id?: number;
    barcode: string;
    name: {
        de: string;
        en: string;
    };
    price: number;
    stock: number;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Transaction {
    id?: number;
    timestamp: Date;
    items: CartItem[];
    total: number;
    paymentMethod: 'cash' | 'card';
    cashGiven?: number;
    changeGiven?: number;
}

export interface Settings {
    language: 'de' | 'en';
    storeName: string;
    cashierName: string;
    cameraDeviceId?: string;
}
