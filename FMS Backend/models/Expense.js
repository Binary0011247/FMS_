class Expense {
    constructor(id, user_id, title, amount, category, created_at) {
      this.id = id;
      this.user_id = user_id;
      this.title = title;
      this.amount = amount;
      this.category = category;
      this.created_at = created_at;
    }
  }
  
  module.exports = Expense;
  