export type ProductEditFormProps = {
  product: {
    id: string
    name: string
    description?: string
    price: number
    productImages: {
      imageUrl: string
      isPrincipal: boolean
    }[]
  }
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
}
