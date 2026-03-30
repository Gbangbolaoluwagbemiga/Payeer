;; Payeer Smart Contract
;; A simple contract to manage bills and record the randomly chosen payer.

(define-data-var session-counter uint u0)

(define-map Sessions
  uint
  {
    creator: principal,
    amount: uint,
    reason: (string-ascii 50),
    is-resolved: bool,
    chosen-payer: (optional principal),
    participants-count: uint
  }
)

(define-map SessionParticipants
  { session-id: uint, participant-id: uint }
  {
    participant-principal: principal,
