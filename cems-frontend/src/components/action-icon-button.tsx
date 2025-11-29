import { Button, type ButtonProps } from '@/components/ui/button'

type ActionIconButtonProps = Omit<ButtonProps, 'children'> & {
  icon: React.ReactNode
  label: string
}

export function ActionIconButton({ icon, label, ...props }: ActionIconButtonProps) {
  return (
    <Button title={label} aria-label={label} {...props}>
      {icon}
    </Button>
  )
}
