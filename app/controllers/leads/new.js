import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({

  store: Ember.inject.service(),
  sessionAccount: Ember.inject.service(),
  errors: DS.Errors.create(),

  companyId: '',
  isEmpty: Ember.computed.empty('name'),
  isValidInput: Ember.computed.not('isEmpty'),
  notSelected: Ember.computed.match('companyId', /^$/),
  isValidSelection: Ember.computed.not('notSelected'),
  isValid: Ember.computed.and('isValidInput', 'isValidSelection'),
  isDisabled: Ember.computed.not('isValid'),

  validate() {
    this.set('errors', DS.Errors.create());
    if (this.get('isEmpty')) {
      this.get('errors').add('name', "name can't be empty");
    }
    if(this.get('notSelected')) {
      this.get('errors').add('company', "select a company")
    }
    return this.get('errors.isEmpty');
  },

  actions: {
    selectCompany(id) {
      let company = this.get('model.companies').findBy("id", id);
      this.set('companyId', id);
      this.set('selectedCompany', company);
    },

    createLead(name, company) {
      if(this.validate()) {
        let lead = this.get('store').createRecord('lead', {
          company: company,
          name: name
        });
        this.set('name', '');
        lead.save().then(() => {
          this.get('sessionAccount.currentUser').reload();
          this.transitionToRoute('leads.lead', lead);
        });
      }
    }
  }
});
