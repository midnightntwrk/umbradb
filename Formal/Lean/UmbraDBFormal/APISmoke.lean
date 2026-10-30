import Mathlib.Order.Interval.Set.Disjoint

namespace UmbraDBFormal.APISmoke

theorem watermark_overwrite [DecidableEq Key] (store : Key → Value) (key : Key)
    (first second : Value) :
    Function.update (Function.update store key first) key second =
      Function.update store key second := by
  funext query
  by_cases h : query = key <;> simp [h]

theorem adjacent_Ico_disjoint [Preorder Time] (start middle finish : Time)
    (_h₁ : start ≤ middle) (_h₂ : middle ≤ finish) :
    Disjoint (Set.Ico start middle) (Set.Ico middle finish) := by
  exact Set.Ico_disjoint_Ico_same

end UmbraDBFormal.APISmoke
