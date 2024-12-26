import React from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import './terms-and-conditions.css'

interface TermsAndConditionsProps {
  onClose: () => void
  onAccept: () => void
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onClose, onAccept }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="terms-dialog-content">
        <DialogHeader>
          <DialogTitle>Términos y Condiciones</DialogTitle>
          <DialogDescription>
            Por favor, lea atentamente los siguientes términos y condiciones antes de aceptar.
          </DialogDescription>
        </DialogHeader>
        <div className="terms-dialog-body">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl. Nullam auctor, nisl nec ultricies lacinia, nisl nisl aliquam nisl, nec aliquam nisl nisl sit amet nisl.
          </p>
        </div>
        <div className="terms-dialog-footer">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={onAccept}>Aceptar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TermsAndConditions

