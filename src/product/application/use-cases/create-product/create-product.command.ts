
export class CreateProductCommand {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly sku: string,
        public readonly currency: string,
        public readonly stock: number,
        public readonly isActive: boolean,
        public readonly lowStockThreshold: number
    ) {
        
    }
}