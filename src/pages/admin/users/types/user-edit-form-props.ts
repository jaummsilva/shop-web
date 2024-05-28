import type { UsersTableRowProps } from '../page'

export type UserEditFormProps = {
  user: UsersTableRowProps['user']
  isSheetOpen: boolean
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
}
