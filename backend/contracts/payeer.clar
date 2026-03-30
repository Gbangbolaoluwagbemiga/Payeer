;; Payeer Smart Contract
;; A simple contract to manage bills and record the randomly chosen payer.

(define-data-var session-counter uint u0)

(define-map Sessions
  uint
  {
    creator: principal,
    amount: uint,
