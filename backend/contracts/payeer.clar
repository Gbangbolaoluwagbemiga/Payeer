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

;; add a participant
(define-public (add-participant (session-id uint) (name (string-ascii 50)) (participant principal))
  (let
    (
      (session (unwrap! (map-get? Sessions session-id) (err u404)))
      (count (get participants-count session))
      (new-count (+ count u1))
    )
    (asserts! (is-eq tx-sender (get creator session)) (err u403))
    ;; Must not be resolved
    (asserts! (not (get is-resolved session)) (err u400))
    
    (map-insert SessionParticipants { session-id: session-id, participant-id: count } {
      participant-principal: participant,
      participant-name: name
    })
    
    (map-set Sessions session-id (merge session { participants-count: new-count }))
    (ok new-count)
  )
)

;; Resolve session with the randomly chosen payer from frontend spinner
(define-public (resolve-session (session-id uint) (chosen-participant principal))
  (let
    (
      (session (unwrap! (map-get? Sessions session-id) (err u404)))
      (count (get participants-count session))
    )
    (asserts! (is-eq tx-sender (get creator session)) (err u403))
    (asserts! (not (get is-resolved session)) (err u400))
    (asserts! (> count u0) (err u400))
    
    (map-set Sessions session-id (merge session {
      is-resolved: true,
      chosen-payer: (some chosen-participant)
    }))
    
    (ok true)
  )
)

;; Read only functions
(define-read-only (get-session (session-id uint))
  (map-get? Sessions session-id)
)

(define-read-only (get-participant (session-id uint) (participant-id uint))
  (map-get? SessionParticipants { session-id: session-id, participant-id: participant-id })
)
