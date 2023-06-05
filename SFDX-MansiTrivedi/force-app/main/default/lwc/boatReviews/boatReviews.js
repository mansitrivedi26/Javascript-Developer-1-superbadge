// imports
import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getAllReviews from "@salesforce/apex/BoatDataService.getAllReviews";

export default class BoatReviews extends NavigationMixin(LightningElement) {
  // Private
  boatId;
  error;
  boatReviews;
  isLoading;

  // Getter and Setter to allow for logic to run on recordId change
  @api
  get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    //sets boatId attribute
    //sets boatId assignment
    //get reviews associated with boatId
    this.setAttribute("boatId", value);
    this.boatId = value;
    this.getReviews();
  }

  // Getter to determine if there are reviews to display
  @api
  get reviewsToShow() {
    return !!(this.boatReviews && this.boatReviews.length);
  }

  // Public method to force a refresh of the reviews invoking getReviews
  @api
  refresh() {
    this.getReviews();
  }

  // Imperative Apex call to get reviews for given boat
  // returns immediately if boatId is empty or null
  // sets isLoading to true during the process and false when it’s completed
  // Gets all the boatReviews from the result, checking for errors.
  getReviews() {
    if (!this.boatId) {
      return;
    }
    this.isLoading = true;

    try {
      getAllReviews({ boatId: this.boatId })
        .then((data) => {
          this.boatReviews = data;
        })
        .catch((error) => {
          this.boatReviews = null;
          this.error = error.message;
        })
        .finaly(() => {
          this.isLoading = false;
        });
    } catch (error) {
      this.error = error;
      this.isLoading = false;
    }
  }

  // Helper method to use NavigationMixin to navigate to a given record on click
  navigateToRecord(event) {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: event.target.dataset.recordId,
        actionName: "view"
      }
    });
  }
}
