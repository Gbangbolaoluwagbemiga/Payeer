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
    participant-name: (string-ascii 50)
  }
)

;; create a new session
(define-public (create-session (amount uint) (reason (string-ascii 50)))
  (let
    (
      (session-id (+ (var-get session-counter) u1))
    )
    (var-set session-counter session-id)
    (map-insert Sessions session-id {
      creator: tx-sender,
      amount: amount,
      reason: reason,
      is-resolved: false,
      chosen-payer: none,
      participants-count: u0
    })
    (ok session-id)
  )
)
