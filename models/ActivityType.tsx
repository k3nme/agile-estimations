class ActivityType {
  static readonly ESTIMATION = {
    id: 1,
    name: "Estimation",
    disabled: false,
  };
  static readonly RETROSPECTIVE = {
    id: 2,
    name: "Retrospective (Beta)",
    disabled: true,
  };
  public static readonly _activityTypes = [
    ActivityType.ESTIMATION,
    ActivityType.RETROSPECTIVE,
  ];

  private constructor() {}
}

export default {
  ActivityType,
  _activityTypes: ActivityType._activityTypes,
};
